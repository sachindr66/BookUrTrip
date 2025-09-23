// In your backend (busRoutes.js or paymentRoutes.js)
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ error: "Order creation failed" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, error: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
};