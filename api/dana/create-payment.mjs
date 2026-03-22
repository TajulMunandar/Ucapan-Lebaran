/**
 * DANA Payment Create Order API
 * Endpoint: /api/dana/create-payment
 * 
 * Uses official DANA Node.js library
 */

console.log('=== CREATE PAYMENT API START ===');

// Get environment variables
const DANA_API_BASE_URL = process.env.DANA_API_BASE_URL;
const DANA_MERCHANT_ID = process.env.DANA_MERCHANT_ID;
const DANA_CLIENT_ID = process.env.DANA_CLIENT_ID;
const DANA_CLIENT_SECRET = process.env.DANA_CLIENT_SECRET;
const DANA_PRIVATE_KEY = process.env.DANA_PRIVATE_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || 'https://ucapan-lebaran-nine.vercel.app';

// ORIGIN for DANA library
const ORIGIN = process.env.ORIGIN || SITE_URL;

// Environment
const ENV = DANA_API_BASE_URL?.includes('sandbox') ? 'sandbox' : 'production';

console.log('Environment check:');
console.log('- DANA_API_BASE_URL:', DANA_API_BASE_URL ? `SET (${DANA_API_BASE_URL})` : 'MISSING');
console.log('- DANA_MERCHANT_ID:', DANA_MERCHANT_ID ? `SET (${DANA_MERCHANT_ID})` : 'MISSING');
console.log('- DANA_CLIENT_ID:', DANA_CLIENT_ID ? `SET (${DANA_CLIENT_ID})` : 'MISSING');
console.log('- DANA_PRIVATE_KEY:', DANA_PRIVATE_KEY ? `SET (${DANA_PRIVATE_KEY.substring(0, 20)}...)` : 'MISSING');
console.log('- ORIGIN:', ORIGIN ? `SET (${ORIGIN})` : 'MISSING');
console.log('- ENV:', ENV);
console.log('- SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'MISSING');
console.log('- SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY ? 'SET' : 'MISSING');

const PRICE_IDR = 1000;

// Validate required environment variables
function validateEnv() {
  const missing = [];
  if (!DANA_MERCHANT_ID) missing.push('DANA_MERCHANT_ID');
  if (!DANA_CLIENT_ID) missing.push('DANA_CLIENT_ID');
  if (!DANA_PRIVATE_KEY) missing.push('DANA_PRIVATE_KEY');
  if (!ORIGIN) missing.push('ORIGIN');
  if (!SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY) missing.push('SUPABASE_SERVICE_KEY');

  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

/**
 * Initialize DANA client
 * The Dana library reads from environment variables, so we need to set them
 */
async function getDanaClient() {
  // Set environment variables that Dana library requires
  process.env.PRIVATE_KEY = DANA_PRIVATE_KEY;
  process.env.ORIGIN = ORIGIN;
  process.env.X_PARTNER_ID = DANA_CLIENT_ID;
  process.env.ENV = ENV;
  
  console.log('DANA Environment:');
  console.log('- PRIVATE_KEY set:', !!process.env.PRIVATE_KEY);
  console.log('- ORIGIN:', process.env.ORIGIN);
  console.log('- X_PARTNER_ID:', process.env.X_PARTNER_ID);
  console.log('- ENV:', process.env.ENV);
  
  // Use the named export 'Dana' from dana-node
  const { Dana } = await import('dana-node');
  
  const dana = new Dana();
  console.log('DANA client created with opts:', dana.opts);
  
  return dana;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variables first
    const envCheck = validateEnv();
    if (!envCheck.valid) {
      return res.status(500).json({
        error: 'Configuration error',
        message: `Missing environment variables: ${envCheck.missing.join(', ')}`
      });
    }

    const { greetingId, slug } = req.body;

    if (!greetingId || !slug) {
      return res.status(400).json({ error: 'Missing greetingId or slug' });
    }

    console.log('Creating DANA payment for greeting:', greetingId);

    // Get Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

    // Get DANA client and initialize
    const dana = await getDanaClient();
    console.log('DANA client initialized');

    // Generate order ID
    const orderId = `ORD-${greetingId.slice(0, 8)}-${Date.now()}`;
    
    // Calculate validUpTo (30 minutes from now) - must match pattern: YYYY-MM-DDTHH:mm:ss+07:00 (max 25 chars)
    const now = new Date(Date.now() + 30 * 60 * 1000);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const validUpTo = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;

    // Create DANA payment request using correct API format
    const paymentRequest = {
      partnerReferenceNo: orderId,
      merchantId: DANA_MERCHANT_ID,
      amount: {
        value: (PRICE_IDR).toFixed(2), // Amount in IDR with 2 decimal places (1000.00)
        currency: 'IDR'
      },
      validUpTo: validUpTo,
      payOptionDetails: [
        {
          payMethod: 'VIRTUAL_ACCOUNT',
          payOption: 'VIRTUAL_ACCOUNT_BRI', // Use VA for sandbox
          transAmount: {
            value: (PRICE_IDR).toFixed(2),
            currency: 'IDR'
          },
          additionalInfo: {
            phoneNumber: '+62812345678',
            // Additional VA-specific fields
            bankCode: 'BRI'
          }
        }
      ],
      urlParams: [
        {
          url: `${SITE_URL}/success?order_id=${orderId}&greeting_id=${greetingId}`,
          type: 'PAY_RETURN',
          isDeeplink: false
        },
        {
          url: `${SITE_URL}/api/dana/finish`,
          type: 'NOTIFICATION',
          isDeeplink: false
        }
      ],
      additionalInfo: {
        merchantName: 'Ucapan Lebaran',
        orderDescription: `Pembayaran Ucapan Lebaran untuk ${greeting.receiver_name}`,
        phoneNumber: '+62812345678'
      }
    };

    console.log('Payment request:', JSON.stringify(paymentRequest));

    // Create payment using DANA library
    let paymentResponse;
    try {
      paymentResponse = await dana.paymentGatewayApi.createOrder(paymentRequest);
    } catch (error) {
      console.error('DANA API Error:', error);
      // Try to get more error details
      if (error.response) {
        console.error('Error response:', error.response);
      }
      throw error;
    }
    
    console.log('Payment Response:', JSON.stringify(paymentResponse).substring(0, 500));

    // Check for success response code (2005400)
    if (paymentResponse.responseCode !== '2005400') {
      console.error('DANA payment creation failed:', paymentResponse.responseMessage);
      return res.status(400).json({
        error: 'Failed to create payment',
        details: paymentResponse.responseMessage || paymentResponse.resultMsg
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

    // Return payment URL to client (Host-to-Host returns webRedirectUrl)
    const paymentUrl = paymentResponse.webRedirectUrl || 
                      paymentResponse.paymentUrl || 
                      paymentResponse.data?.webRedirectUrl ||
                      paymentResponse.data?.paymentUrl;

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
    console.error('=== ERROR CREATING PAYMENT ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
