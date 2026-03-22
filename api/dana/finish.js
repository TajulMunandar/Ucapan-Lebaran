/**
 * DANA Payment Callback API
 * Endpoint: /api/dana/finish
 * 
 * Handles DANA payment callback/webhook and updates Supabase
 */

// Debug: Log environment check
console.log('Finish API environment:', {
  DANA_API_BASE_URL: process.env.DANA_API_BASE_URL ? 'set' : 'missing',
  MERCHANT_ID: process.env.DANA_MERCHANT_ID ? 'set' : 'missing',
  CLIENT_ID: process.env.DANA_CLIENT_ID ? 'set' : 'missing',
  SUPABASE_URL: process.env.SUPABASE_URL ? 'set' : 'missing',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'set' : 'missing',
});

const crypto = require('crypto');

const MERCHANT_ID = process.env.DANA_MERCHANT_ID;
const CLIENT_ID = process.env.DANA_CLIENT_ID;
const CLIENT_SECRET = process.env.DANA_CLIENT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
    const body = req.body;
    
    console.log('DANA callback received:', JSON.stringify(body));

    // Extract payment info from callback
    const { 
      orderId, 
      merchantOrderId, 
      status, 
      amount,
      transactionId 
    } = body;

    // Validate required fields
    if (!merchantOrderId) {
      console.error('Missing merchantOrderId in callback');
      return res.status(400).json({ error: 'Missing merchantOrderId' });
    }

    // Get Supabase client
    const supabase = createSupabaseClient();

    // Find greeting by payment_id (orderId) or id (merchantOrderId)
    let greetingId = merchantOrderId;
    
    // First try to find by payment_id (orderId from DANA)
    if (orderId) {
      const { data: existingGreeting } = await supabase
        .from('greetings')
        .select('id, payment_status')
        .eq('payment_id', orderId)
        .single();
      
      if (existingGreeting) {
        greetingId = existingGreeting.id;
      }
    }

    // Fetch greeting to verify it exists
    const { data: greeting, error: fetchError } = await supabase
      .from('greetings')
      .select('id, payment_status, is_paid, payment_id')
      .eq('id', greetingId)
      .single();

    if (fetchError || !greeting) {
      console.error('Greeting not found for callback:', greetingId);
      return res.status(404).json({ error: 'Greeting not found' });
    }

    // Check if already processed
    if (greeting.payment_status === 'paid' && greeting.is_paid) {
      console.log('Payment already processed for greeting:', greetingId);
      return res.status(200).json({ 
        success: true, 
        message: 'Payment already processed' 
      });
    }

    // Determine payment status based on DANA response
    let newPaymentStatus = 'pending';
    let isPaid = false;

    // DANA status codes:
    // 2000000 = Success
    // 2000001 = Pending
    // 4000101 = Failed
    // 4000102 = Cancelled
    // 4000103 = Expired
    
    if (status === 'SUCCESS' || body.resultCode === '2000000') {
      newPaymentStatus = 'paid';
      isPaid = true;
    } else if (status === 'PENDING' || body.resultCode === '2000001') {
      newPaymentStatus = 'pending';
      isPaid = false;
    } else if (status === 'FAILED' || status === 'CANCELLED' || status === 'EXPIRED' || 
               body.resultCode === '4000101' || body.resultCode === '4000102' || body.resultCode === '4000103') {
      newPaymentStatus = 'rejected';
      isPaid = false;
    } else {
      // Default to pending if unknown status
      newPaymentStatus = 'pending';
    }

    console.log('Updating payment status:', {
      greetingId,
      oldStatus: greeting.payment_status,
      newStatus: newPaymentStatus,
      isPaid,
      orderId,
      transactionId,
    });

    // Update greeting with payment status
    const updateData = {
      payment_status: newPaymentStatus,
      is_paid: isPaid,
      updated_at: new Date().toISOString(),
    };

    // Set paid_at if payment is successful
    if (isPaid) {
      updateData.paid_at = new Date().toISOString();
    }

    // Add transaction info if available
    if (transactionId) {
      updateData.payment_proof_url = transactionId;
    }

    const { error: updateError } = await supabase
      .from('greetings')
      .update(updateData)
      .eq('id', greetingId);

    if (updateError) {
      console.error('Failed to update greeting payment status:', updateError);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    console.log('Payment status updated successfully for greeting:', greetingId);

    // Return success response to DANA
    return res.status(200).json({
      success: true,
      message: 'Payment status updated',
      orderId: orderId,
      merchantOrderId: merchantOrderId,
      newStatus: newPaymentStatus,
    });

  } catch (error) {
    console.error('Error processing DANA callback:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
