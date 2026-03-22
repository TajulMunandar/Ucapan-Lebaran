/**
 * DANA Payment Create Order API
 * Endpoint: /api/dana/create-payment
 * 
 * Creates a DANA payment order and returns the payment URL
 */

// Debug: Log all env vars (without secrets)
console.log('Environment check:', {
  DANA_API_BASE_URL: process.env.DANA_API_BASE_URL ? 'set' : 'missing',
  MERCHANT_ID: process.env.DANA_MERCHANT_ID ? 'set' : 'missing',
  CLIENT_ID: process.env.DANA_CLIENT_ID ? 'set' : 'missing',
  CLIENT_SECRET: process.env.DANA_CLIENT_SECRET ? 'set' : 'missing',
  SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'missing',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'set' : 'missing',
});

const crypto = require('crypto');

const DANA_API_BASE_URL = process.env.DANA_API_BASE_URL || 'https://api.sandbox.dana.id';
const MERCHANT_ID = process.env.DANA_MERCHANT_ID;
const CLIENT_ID = process.env.DANA_CLIENT_ID;
const CLIENT_SECRET = process.env.DANA_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || 'https://ucapan-lebaran-nine.vercel.app';

const PRICE_IDR = 1000; // Rp 1,000

// Validate required environment variables
function validateEnv() {
  const missing = [];
  if (!MERCHANT_ID) missing.push('DANA_MERCHANT_ID');
  if (!CLIENT_ID) missing.push('DANA_CLIENT_ID');
  if (!CLIENT_SECRET) missing.push('DANA_CLIENT_SECRET');
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY) missing.push('SUPABASE_SERVICE_KEY');
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Generate DANA signature
 */
function generateSignature(payload, timestamp) {
  const signaturePayload = `POST${DANA_API_BASE_URL}/v2.0/payment/gateway/create*${JSON.stringify(payload)}*${timestamp}`;
  const signature = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(signaturePayload)
    .digest('hex');
  return signature;
}

/**
 * Create Supabase admin client
 */
function createSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/**
 * Get access token from DANA
 */
async function getDanaAccessToken() {
  const timestamp = Date.now().toString();
  
  const payload = {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    grantType: 'client_credentials',
    merchantId: MERCHANT_ID,
  };

  const signaturePayload = `POST${DANA_API_BASE_URL}/v2.0/oauth/authorize*${JSON.stringify(payload)}*${timestamp}`;
  const signature = crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(signaturePayload)
    .digest('hex');

  const response = await fetch(`${DANA_API_BASE_URL}/v2.0/oauth/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': CLIENT_ID,
      'Request-Id': crypto.randomUUID(),
      'Timestamp': timestamp,
      'Signature': signature,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  console.log('DANA OAuth response:', JSON.stringify(data));
  
  if (data.resultCode !== '2000000') {
    throw new Error(`DANA auth failed: ${data.resultMsg || 'Unknown error'}`);
  }

  return data.accessToken;
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables first
    validateEnv();
    
    const { greetingId, slug } = req.body;

    if (!greetingId || !slug) {
      return res.status(400).json({ error: 'Missing greetingId or slug' });
    }

    console.log('Creating DANA payment for greeting:', greetingId);

    // Get Supabase client
    const supabase = createSupabaseClient();

    // Fetch greeting to verify it exists
    const { data: greeting, error: fetchError } = await supabase
      .from('greetings')
      .select('id, sender_name, receiver_name, payment_status, is_paid')
      .eq('id', greetingId)
      .single();

    if (fetchError || !greeting) {
      console.error('Greeting not found:', fetchError);
      return res.status(404).json({ error: 'Greeting not found' });
    }

    // Check if already paid
    if (greeting.payment_status === 'paid' || greeting.is_paid) {
      return res.status(400).json({ error: 'Payment already completed' });
    }

    // Get DANA access token
    const accessToken = await getDanaAccessToken();

    // Generate order ID
    const orderId = `ORD-${greetingId.slice(0, 8)}-${Date.now()}`;
    const timestamp = Date.now().toString();

    // Create DANA payment request
    const paymentRequest = {
      order: {
        orderId: orderId,
        orderAmount: PRICE_IDR.toString(),
        orderDescription: `Pembayaran Ucapan Lebaran untuk ${greeting.receiver_name}`,
        merchantId: MERCHANT_ID,
      },
      payment: {
        paymentMethod: 'DANA',
        paymentType: 'single',
        redirectUrl: `${SITE_URL}/success?order_id=${orderId}`,
      },
      merchantExtendInfo: {
        merchantName: 'Ucapan Lebaran',
      },
      merchantOrderId: greetingId, // This maps to our greeting ID
    };

    // Generate signature
    const signature = generateSignature(paymentRequest, timestamp);

    // Call DANA API
    const response = await fetch(`${DANA_API_BASE_URL}/v2.0/payment/gateway/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': CLIENT_ID,
        'Request-Id': crypto.randomUUID(),
        'Timestamp': timestamp,
        'Signature': signature,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentRequest),
    });

    const paymentResponse = await response.json();
    console.log('DANA payment response:', JSON.stringify(paymentResponse));

    if (paymentResponse.resultCode !== '2000000') {
      console.error('DANA payment creation failed:', paymentResponse.resultMsg);
      return res.status(400).json({ 
        error: 'Failed to create payment',
        details: paymentResponse.resultMsg 
      });
    }

    // Update greeting with payment ID and set to pending
    const { error: updateError } = await supabase
      .from('greetings')
      .update({
        payment_id: orderId,
        payment_status: 'pending',
        payment_method: 'dana',
        updated_at: new Date().toISOString(),
      })
      .eq('id', greetingId);

    if (updateError) {
      console.error('Failed to update greeting:', updateError);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    // Return payment URL to client
    const paymentUrl = paymentResponse.paymentUrl || paymentResponse.data?.paymentUrl;
    
    if (!paymentUrl) {
      console.error('No payment URL in response:', paymentResponse);
      return res.status(500).json({ error: 'No payment URL returned from DANA' });
    }

    console.log('Payment URL generated:', paymentUrl);

    return res.status(200).json({
      success: true,
      paymentUrl,
      orderId,
      greetingId,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
