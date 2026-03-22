/**
 * DANA Payment Status Check API
 * Endpoint: /api/dana/check-status
 * 
 * Check payment status from DANA and update Supabase if needed
 */

console.log('Check Status API environment:', {
  DANA_API_BASE_URL: process.env.DANA_API_BASE_URL ? 'set' : 'missing',
  MERCHANT_ID: process.env.DANA_MERCHANT_ID ? 'set' : 'missing',
  CLIENT_ID: process.env.DANA_CLIENT_ID ? 'set' : 'missing',
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
  
  if (data.resultCode !== '2000000') {
    throw new Error(`DANA auth failed: ${data.resultMsg || 'Unknown error'}`);
  }

  return data.accessToken;
}

/**
 * Create Supabase admin client
 */
function createSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order_id, greeting_id } = req.query;

    if (!order_id && !greeting_id) {
      return res.status(400).json({ error: 'Missing order_id or greeting_id' });
    }

    console.log('Checking payment status:', { order_id, greeting_id });

    // Get Supabase client
    const supabase = createSupabaseClient();

    // Find greeting
    let greeting;
    if (order_id) {
      const { data, error } = await supabase
        .from('greetings')
        .select('id, payment_status, is_paid, payment_id, slug, sender_name, receiver_name')
        .eq('payment_id', order_id)
        .single();
      
      greeting = data;
      if (error) {
        console.error('Error fetching greeting by order_id:', error);
      }
    } else if (greeting_id) {
      const { data, error } = await supabase
        .from('greetings')
        .select('id, payment_status, is_paid, payment_id, slug, sender_name, receiver_name')
        .eq('id', greeting_id)
        .single();
      
      greeting = data;
      if (error) {
        console.error('Error fetching greeting by id:', error);
      }
    }

    if (!greeting) {
      return res.status(404).json({ error: 'Greeting not found' });
    }

    // If already paid in our DB, return success
    if (greeting.payment_status === 'paid' || greeting.is_paid) {
      return res.status(200).json({
        success: true,
        status: 'paid',
        greeting: {
          id: greeting.id,
          slug: greeting.slug,
          sender_name: greeting.sender_name,
          receiver_name: greeting.receiver_name,
        },
      });
    }

    // Try to check status from DANA if we have an order ID
    if (greeting.payment_id && CLIENT_ID && CLIENT_SECRET) {
      try {
        const accessToken = await getDanaAccessToken();
        const timestamp = Date.now().toString();

        const queryPayload = {
          merchantId: MERCHANT_ID,
          orderId: greeting.payment_id,
        };

        const signaturePayload = `POST${DANA_API_BASE_URL}/v2.0/payment/gateway/query*${JSON.stringify(queryPayload)}*${timestamp}`;
        const signature = crypto
          .createHmac('sha256', CLIENT_SECRET)
          .update(signaturePayload)
          .digest('hex');

        const response = await fetch(`${DANA_API_BASE_URL}/v2.0/payment/gateway/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Client-Id': CLIENT_ID,
            'Request-Id': crypto.randomUUID(),
            'Timestamp': timestamp,
            'Signature': signature,
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(queryPayload),
        });

        const danaResponse = await response.json();
        console.log('DANA query response:', JSON.stringify(danaResponse));

        // Update our DB based on DANA status
        if (danaResponse.resultCode === '2000000') {
          const danaStatus = danaResponse.orderStatus;
          
          let newPaymentStatus = 'pending';
          let isPaid = false;

          if (danaStatus === 'SUCCESS') {
            newPaymentStatus = 'paid';
            isPaid = true;
          } else if (danaStatus === 'FAILED' || danaStatus === 'CANCELLED' || danaStatus === 'EXPIRED') {
            newPaymentStatus = 'rejected';
          }

          // Update if status changed
          if (newPaymentStatus !== greeting.payment_status) {
            const updateData = {
              payment_status: newPaymentStatus,
              is_paid: isPaid,
              updated_at: new Date().toISOString(),
            };

            if (isPaid) {
              updateData.paid_at = new Date().toISOString();
            }

            await supabase
              .from('greetings')
              .update(updateData)
              .eq('id', greeting.id);
          }

          return res.status(200).json({
            success: true,
            status: newPaymentStatus,
            greeting: {
              id: greeting.id,
              slug: greeting.slug,
              sender_name: greeting.sender_name,
              receiver_name: greeting.receiver_name,
            },
          });
        }
      } catch (danaError) {
        console.error('Error querying DANA:', danaError);
        // Continue to return local status
      }
    }

    // Return local status
    return res.status(200).json({
      success: true,
      status: greeting.payment_status || 'pending',
      greeting: {
        id: greeting.id,
        slug: greeting.slug,
        sender_name: greeting.sender_name,
        receiver_name: greeting.receiver_name,
      },
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
