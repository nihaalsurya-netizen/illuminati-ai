const crypto = require('crypto');

/* Vercel serverless function — verifies a Razorpay payment signature.
   Migrated from netlify/functions/verify-payment.js */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing required fields'
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing RAZORPAY_KEY_SECRET');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate expected signature
    const payload = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const isVerified = expectedSignature === razorpay_signature;

    console.log(`Payment verification: ${isVerified ? 'SUCCESS' : 'FAILED'} for order ${razorpay_order_id}`);

    if (isVerified) {
      return res.status(200).json({
        verified: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    }

    return res.status(400).json({
      verified: false,
      message: 'Payment signature verification failed'
    });
  } catch (error) {
    const rzpDesc = error && error.error && error.error.description;
    const rzpCode = error && error.error && error.error.code;
    const detailsMsg = (error && error.message) || rzpDesc || 'Unknown error';

    console.error('Verify payment error:', {
      message: error && error.message,
      code: rzpCode,
      description: rzpDesc
    });

    return res.status(500).json({
      verified: false,
      error: 'Verification failed',
      details: detailsMsg,
      code: rzpCode || null
    });
  }
};
