const Razorpay = require('razorpay');

/* Vercel serverless function — creates a Razorpay order.
   Migrated from netlify/functions/create-order.js
   Netlify's (event) => {statusCode, body} shape becomes Vercel's (req, res). */

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel parses JSON bodies automatically, but guard against string bodies.
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const {
      amount,
      currency = 'INR',
      receipt,
      customer_name,
      customer_email,
      customer_phone,
      product_name
    } = body;

    // Validate amount
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Amount must be at least 100 paise (₹1)' });
    }

    // Validate customer details
    const trimmedName = (customer_name || '').trim();
    const trimmedEmail = (customer_email || '').trim();
    const rawPhone = (customer_phone || '').trim();
    const phoneDigits = rawPhone.replace(/^\+?91/, '').replace(/\D/g, '');

    if (trimmedName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters', field: 'customer_name' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Valid email is required', field: 'customer_email' });
    }
    if (phoneDigits.length !== 10) {
      return res.status(400).json({ error: 'Phone must be 10 digits (optional +91 prefix)', field: 'customer_phone' });
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create order
    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Ensure integer paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        source: 'illuminati-ai-website',
        customer_name: trimmedName,
        customer_email: trimmedEmail,
        customer_phone: phoneDigits,
        product_name: (product_name || 'Illuminati AI Product').toString().slice(0, 256)
      }
    });

    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID // Public key, safe to return
    });
  } catch (error) {
    // Razorpay SDK errors are not standard Error objects:
    //   { statusCode: 401, error: { description: 'Authentication failed', code: 'BAD_REQUEST_ERROR' } }
    const rzpDesc = error && error.error && error.error.description;
    const rzpCode = error && error.error && error.error.code;
    const rzpStatus = error && error.statusCode;
    const detailsMsg = (error && error.message) || rzpDesc || 'Unknown error';

    console.error('Create order error:', {
      message: error && error.message,
      statusCode: rzpStatus,
      code: rzpCode,
      description: rzpDesc
    });

    return res.status(500).json({
      error: 'Failed to create order',
      details: detailsMsg,
      code: rzpCode || null,
      razorpay_status: rzpStatus || null
    });
  }
};
