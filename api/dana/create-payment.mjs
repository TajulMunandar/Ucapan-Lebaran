/**
 * DANA Payment Create Order API
 * Endpoint: /api/dana/create-payment
 * 
 * Creates a DANA payment order and returns the payment URL
 */

console.log('=== CREATE PAYMENT API START ===');

// Get environment variables with explicit naming
const DANA_API_BASE_URL = process.env.DANA_API_BASE_URL;
const DANA_MERCHANT_ID = process.env.DANA_MERCHANT_ID;
const DANA_CLIENT_ID = process.env.DANA_CLIENT_ID;
const DANA_CLIENT_SECRET_VAL = process.env.DANA_CLIENT_SECRET;
const SUPABASE_URL_VAL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY_VAL = process.env.SUPABASE_SERVICE_KEY;
const SITE_URL = process.env.SITE_URL || 'https://ucapan-lebaran-nine.vercel.app';
// DANA Private Key for RSA signing (from environment variable)
const DANA_PRIVATE_KEY = process.env.DANA_PRIVATE_KEY;

console.log('Environment check:');
console.log('- DANA_API_BASE_URL:', DANA_API_BASE_URL ? `SET (${DANA_API_BASE_URL})` : 'MISSING');
console.log('- DANA_MERCHANT_ID:', DANA_MERCHANT_ID ? `SET (${DANA_MERCHANT_ID})` : 'MISSING');
console.log('- DANA_CLIENT_ID:', DANA_CLIENT_ID ? `SET (${DANA_CLIENT_ID})` : 'MISSING');
console.log('- DANA_CLIENT_SECRET:', DANA_CLIENT_SECRET_VAL ? `SET (${DANA_CLIENT_SECRET_VAL.substring(0, 10)}...)` : 'MISSING');
console.log('- DANA_PRIVATE_KEY:', DANA_PRIVATE_KEY ? `SET (${DANA_PRIVATE_KEY.substring(0, 20)}...)` : 'MISSING');
console.log('- SUPABASE_URL:', SUPABASE_URL_VAL ? `SET (${SUPABASE_URL_VAL})` : 'MISSING');
console.log('- SUPABASE_SERVICE_KEY:', SUPABASE_SERVICE_KEY_VAL ? 'SET' : 'MISSING');

import crypto from 'crypto';
import http from 'http';
import https from 'https';



/**
 * Convert base64 private key to PEM format
 */
function base64KeyToPEM(base64Key, keyType = 'PRIVATE') {
  try {
    // First try to decode the base64 to verify it's valid
    const decoded = Buffer.from(base64Key, 'base64');
    console.log('Decoded key length:', decoded.length);
    
    const chunks = [];
    for (let i = 0; i < base64Key.length; i += 64) {
      chunks.push(base64Key.substr(i, 64));
    }
    return `-----BEGIN ${keyType} KEY-----\n${chunks.join('\n')}\n-----END ${keyType} KEY-----`;
  } catch (err) {
    console.error('Error converting base64 key to PEM:', err.message);
    throw new Error('Invalid private key format');
  }
}

/**
 * Sign content using RSA-SHA256
 */
function signContent(content, privateKeyPEM) {
  const sign = crypto.createSign('SHA256');
  sign.write(content, 'utf8');
  sign.end();
  return sign.sign(privateKeyPEM, 'base64');
}

/**
 * Generate SHA-256 hash of the body (hex lowercase)
 */
function generateBodyHash(body) {
  return crypto.createHash('sha256').update(body).digest('hex');
}

/**
 * Generate DANA Transactional Token signature
 * Format: <HTTP METHOD> + ":" + <RELATIVE PATH URL> + ":" + LowerCase(HexEncode(SHA-256(Minify(<HTTP BODY>)))) + ":" + <X-TIMESTAMP>
 */
function generateTransactionalSignature(method, path, body, timestamp, privateKeyPEM) {
  // Minify JSON (remove whitespace)
  const minifiedBody = JSON.stringify(JSON.parse(body));
  const bodyHash = generateBodyHash(minifiedBody);
  const stringToSign = `${method}:${path}:${bodyHash}:${timestamp}`;
  console.log('Transactional string to sign:', stringToSign);
  return signContent(stringToSign, privateKeyPEM);
}

/**
 * Generate DANA RSA signature (for v1.0 API)
 */
function generateDanaSignature(method, path, body, timestamp) {
  if (!DANA_PRIVATE_KEY) {
    throw new Error('DANA_PRIVATE_KEY environment variable is not set');
  }

  // Hash the body
  const bodyHash = crypto.createHash('sha256').update(body).digest('hex');

  // Create string to sign: METHOD:path:bodyHash:timestamp
  const stringToSign = `${method}:${path}:${bodyHash}:${timestamp}`;
  console.log('String to sign:', stringToSign);

  // Sign with RSA private key
  const privateKeyPEM = base64KeyToPEM(DANA_PRIVATE_KEY, 'PRIVATE');
  const signature = signContent(stringToSign, privateKeyPEM);

  return signature;
}

const PRICE_IDR = 1000;

// Validate required environment variables
function validateEnv() {
  const missing = [];
  if (!DANA_MERCHANT_ID) missing.push('DANA_MERCHANT_ID');
  if (!DANA_CLIENT_ID) missing.push('DANA_CLIENT_ID');
  if (!DANA_CLIENT_SECRET_VAL) missing.push('DANA_CLIENT_SECRET');
  if (!DANA_PRIVATE_KEY) missing.push('DANA_PRIVATE_KEY');
  if (!SUPABASE_URL_VAL) missing.push('SUPABASE_URL');
  if (!SUPABASE_SERVICE_KEY_VAL) missing.push('SUPABASE_SERVICE_KEY');

  if (missing.length > 0) {
    return { valid: false, missing };
  }
  return { valid: true };
}

/**
 * Generate DANA signature using Transactional Token method
 * Format: <HTTP METHOD> + ":" + <RELATIVE PATH URL> + ":" + LowerCase(HexEncode(SHA-256(Minify(<HTTP BODY>)))) + ":" + <X-TIMESTAMP>
 */
function generateSignature(payload, timestamp) {
  const path = "/v2.0/oauth/authorize";
  const body = JSON.stringify(payload);
  return generateTransactionalSignature("POST", path, body, timestamp, base64KeyToPEM(DANA_PRIVATE_KEY, "PRIVATE"));
}

/**
 * Generate payment signature using Transactional Token method
 */
function generatePaymentSignature(payload, timestamp) {
  const path = "/v2.0/payment/gateway/create";
  const body = JSON.stringify(payload);
  return generateTransactionalSignature("POST", path, body, timestamp, base64KeyToPEM(DANA_PRIVATE_KEY, "PRIVATE"));
}

/**
 * Make HTTP request using native Node.js https
 */
function makeHttpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      rejectUnauthorized: true,
    };

    console.log('Making request to:', url);
    console.log('Request options:', JSON.stringify(requestOptions));

    const req = (isHttps ? https : http).request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response headers:', JSON.stringify(res.headers));
        console.log('Response body length:', data.length);
        console.log('Response body (first 500):', data.substring(0, 500));
        
        // Check for redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log('Redirect to:', res.headers.location);
        }
        
        // Check for error status
        if (res.statusCode >= 400) {
          console.error('HTTP Error:', res.statusCode, data.substring(0, 200));
        }
        
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', (err) => {
      console.error('Request error:', err.message);
      console.error('Error code:', err.code);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(30000);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

/**
 * Get access token from DANA
 * Uses Transactional Token method with body hash in signature
 */
async function getDanaAccessToken() {
  const timestamp = new Date()
  .toISOString()
  .replace("Z", "+07:00")

  // Using v2.0 OAuth endpoint
  const path = "/v2.0/oauth/authorize"
  
  const payload = {
    grantType: "client_credentials",
    clientId: DANA_CLIENT_ID,
    partnerId: DANA_MERCHANT_ID
  }

  const body = JSON.stringify(payload)

  const privateKeyPEM = base64KeyToPEM(DANA_PRIVATE_KEY, "PRIVATE")

  // Use Transactional Token method signature
  const signature = generateTransactionalSignature("POST", path, body, timestamp, privateKeyPEM)
  console.log('Generated signature:', signature.substring(0, 50) + '...');

  const response = await makeHttpsRequest(
    `${DANA_API_BASE_URL}${path}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CLIENT-KEY": DANA_CLIENT_ID,
        "X-TIMESTAMP": timestamp,
        "X-SIGNATURE": signature,
        "X-PARTNER-ID": DANA_MERCHANT_ID,
        "Authorization": `Bearer ${DANA_CLIENT_ID}`
      }
    },
    body
  )

  // Handle empty response
  if (!response.body || response.body.trim() === '') {
    console.error('Empty response from DANA API');
    console.error('Status:', response.status);
    throw new Error(`DANA API returned empty response. Status: ${response.status}`);
  }

  // Check if response is HTML (error page)
  const responseBodyTrimmed = response.body.trim();
  if (responseBodyTrimmed.startsWith('<!DOCTYPE') || responseBodyTrimmed.startsWith('<html') || responseBodyTrimmed.startsWith('<!DOCTYPE')) {
    console.error('Received HTML error page instead of JSON:', responseBodyTrimmed.substring(0, 300));
    throw new Error(`DANA API returned HTML error page. Status: ${response.status}. Body: ${responseBodyTrimmed.substring(0, 200)}`);
  }

  let data;
  try {
    data = JSON.parse(response.body);
  } catch (parseError) {
    console.error('Failed to parse JSON response:', response.body.substring(0, 200));
    throw new Error(`Invalid JSON response from DANA API: ${response.body.substring(0, 200)}`);
  }

  console.log("OAuth Response:", JSON.stringify(data).substring(0, 200));

  if (data.resultCode !== "2000000") {
    throw new Error(data.resultMsg || `DANA API error: ${data.resultCode}`)
  }

  return data.accessToken
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
    const supabase = createClient(SUPABASE_URL_VAL, SUPABASE_SERVICE_KEY_VAL);

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
    console.log('Got DANA access token');

    // Generate order ID
    const orderId = `ORD-${greetingId.slice(0, 8)}-${Date.now()}`;
    const timestamp = new Date()
  .toISOString()
  .replace("Z", "+07:00")

    // Create DANA payment request
    const paymentRequest = {
      order: {
        orderId: orderId,
        orderAmount: PRICE_IDR.toString(),
        orderDescription: `Pembayaran Ucapan Lebaran untuk ${greeting.receiver_name}`,
        merchantId: DANA_MERCHANT_ID,
      },
      payment: {
        paymentMethod: 'DANA',
        paymentType: 'single',
        redirectUrl: `${SITE_URL}/success?order_id=${orderId}`,
      },
      merchantExtendInfo: {
        merchantName: 'Ucapan Lebaran',
      },
      merchantOrderId: greetingId,
    };

    // Generate signature
    const signature = generatePaymentSignature(paymentRequest, timestamp);
    console.log('Payment signature:', signature.substring(0, 50) + '...');

    // Call DANA API
    const paymentApiUrl = `${DANA_API_BASE_URL}/v2.0/payment/gateway/create`;
    const httpPaymentResponse = await makeHttpsRequest(paymentApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CLIENT-KEY': DANA_CLIENT_ID,
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'X-PARTNER-ID': DANA_MERCHANT_ID,
        'Authorization': `Bearer ${accessToken}`,
      },
    }, JSON.stringify(paymentRequest));

    const paymentResponseText = httpPaymentResponse.body;
    console.log('Payment Response Status:', httpPaymentResponse.status);
    console.log('Payment Response Text:', paymentResponseText.substring(0, 300));

    let paymentResponseData;
    try {
      paymentResponseData = JSON.parse(paymentResponseText);
    } catch (e) {
      throw new Error(`Failed to parse DANA payment response: ${paymentResponseText.substring(0, 200)}`);
    }

    if (paymentResponseData.resultCode !== '2000000') {
      console.error('DANA payment creation failed:', paymentResponseData.resultMsg);
      return res.status(400).json({
        error: 'Failed to create payment',
        details: paymentResponseData.resultMsg
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
    const paymentUrl = paymentResponseData.paymentUrl || paymentResponseData.data?.paymentUrl;

    if (!paymentUrl) {
      console.error('No payment URL in response:', paymentResponseData);
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
