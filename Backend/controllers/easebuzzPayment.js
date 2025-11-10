// import axios from "axios";
// import crypto from "crypto";
// import dotenv from "dotenv";

// dotenv.config();

// export const easebuzzPayment = async (req, res) => {
//   try {
//     const {
//       txnid,
//       amount,
//       productinfo,
//       firstname,
//       phone,
//       email,
//       surl ,
//       furl 
//     } = req.body;

//     // ✅ Enhanced Validation
//     if (!txnid || !amount || !productinfo || !firstname || !email || !phone) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Missing required fields" 
//       });
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Invalid email format" 
//       });
//     }

//     // Phone validation
//     if (!/^\d{10}$/.test(phone)) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Phone must be 10 digits" 
//       });
//     }

//     // Amount validation
//     const amountValue = parseFloat(amount);
//     if (isNaN(amountValue) || amountValue <= 0) {
//       return res.status(400).json({ 
//         success: false,
//         error: "Invalid amount" 
//       });
//     }

//     // ✅ Merchant credentials with validation
//     const key = process.env.EASEBUZZ_KEY?.trim();
//     const salt = process.env.EASEBUZZ_SALT?.trim();

//     if (!key || !salt) {
//       console.error("Easebuzz credentials missing");
//       return res.status(500).json({ 
//         success: false, 
//         error: "Payment gateway configuration error" 
//       });
//     }

//     // ✅ Format amount properly
//     const formattedAmount = amountValue.toFixed(2);

//     // ✅ Hash generation (as per Easebuzz docs)
//     const hashSequence = `${key}|${txnid}|${formattedAmount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
//     const hash = crypto.createHash("sha512").update(hashSequence).digest("hex");

//     // ✅ Prepare form data
//     const formData = new URLSearchParams();
//     formData.append("key", key);
//     formData.append("txnid", txnid);
//     formData.append("amount", formattedAmount);
//     formData.append("productinfo", productinfo);
//     formData.append("firstname", firstname);
//     formData.append("phone", phone);
//     formData.append("email", email);
//     formData.append("surl", surl);
//     formData.append("furl", furl);
//     formData.append("hash", hash);

//     // Log request (without sensitive data)
//     console.log("Easebuzz Payment Initiation:", {
//       txnid,
//       amount: formattedAmount,
//       productinfo,
//       email,
//       timestamp: new Date().toISOString()
//     });

//     // ✅ Send request to Easebuzz
//     const response = await axios.post(
//       "https://testpay.easebuzz.in/payment/initiateLink",
//       formData,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "application/json",
//         },
//         timeout: 10000,
//       }
//     );

//     console.log("Easebuzz API Response:", response.data);

//     // ✅ Return response to client
//     res.status(200).json({
//       success: true,
//       message: "Payment initiated successfully",
//       data: response.data,
//     });

//   } catch (error) {
//     console.error("Easebuzz Payment Error:", {
//       message: error.message,
//       stack: error.stack,
//       response: error.response?.data
//     });

//     // More specific error messages
//     let errorMessage = "Payment initiation failed";
//     if (error.response?.data) {
//       errorMessage = error.response.data.message || errorMessage;
//     } else if (error.code === 'ECONNABORTED') {
//       errorMessage = "Payment gateway timeout";
//     }

//     res.status(500).json({
//       success: false,
//       error: errorMessage,
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };







// const axios = require("axios");
// const crypto = require("crypto");
// require("dotenv").config();

import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

export const easebuzzPayment = async (req, res) => {
  try {
    const { txnid, amount, productinfo, firstname, phone, email, surl, furl } = req.body;

    // ✅ Validate required fields
    if (!txnid || !amount || !productinfo || !firstname || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const key = process.env.EASEBUZZ_KEY?.trim();
    const salt = process.env.EASEBUZZ_SALT?.trim();
    
    // ✅ Validate environment variables
    if (!key || !salt) {
      return res.status(500).json({ 
        success: false,
        error: "Easebuzz credentials not configured. Please check EASEBUZZ_KEY and EASEBUZZ_SALT environment variables." 
      });
    }

    // ✅ Convert to 2 decimal points
    const formattedAmount = parseFloat(amount).toFixed(2);

    // ✅ Hash string (no extra spaces)
    const hashString = `${key}|${txnid}|${formattedAmount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // ✅ Create form data
    const formData = new URLSearchParams({
      key,
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      phone,
      email,
      surl,
      furl,
      hash,
    });

    // ✅ POST to Easebuzz payment API
    const response = await axios.post(
      "https://testpay.easebuzz.in/payment/initiateLink",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    console.log("💳 Easebuzz Response:", response.data);

    res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Easebuzz Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Payment initiation failed",
      details: error.message,
    });
  }
};

/**
 * Handle Easebuzz Payment Callback
 * Similar to Razorpay handler but for redirect-based flow
 * Handles both POST and GET requests from Easebuzz
 */
export const easebuzzPaymentCallback = async (req, res) => {
  try {
    console.log("💳 Easebuzz Payment Callback Received:", {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      body: req.body,
      query: req.query,
      headers: {
        origin: req.headers.origin,
        referer: req.headers.referer
      }
    });

    // Easebuzz sends payment status in POST body or query params
    const paymentData = req.body || {};
    const queryStatus = req.query.status; // From URL parameter we set
    const txnid = paymentData.txnid || req.query.txnid || '';

    // Determine if payment was successful
    // Check URL query parameter first (we set status=success/failure in the URL)
    const statusFromQuery = queryStatus || req.query.status;
    
    // Check POST body fields (Easebuzz might send status in body)
    const statusFromBody = paymentData.status || paymentData.payment_status || paymentData.Status || 
                          paymentData.statuscode || paymentData.statusCode || 
                          paymentData.status_code || paymentData.StatusCode ||
                          paymentData.result || paymentData.Result;
    
    // Check if URL contains 'success' (from our configured success URL)
    const urlContainsSuccess = req.url?.includes('status=success') || 
                               req.originalUrl?.includes('status=success');
    
    const status = statusFromQuery || statusFromBody || '';
    
    console.log("📊 Status Analysis:", {
      queryStatus: statusFromQuery,
      bodyStatus: statusFromBody,
      urlContainsSuccess,
      finalStatus: status,
      txnid: txnid
    });

    // Consider it success if:
    // 1. Query has status=success (we set this in success URL)
    // 2. URL contains status=success
    // 3. Status is 'success', 'SUCCESS', 'Success'
    // 4. Status code is '1' or 1
    const isSuccess = 
      urlContainsSuccess ||
      statusFromQuery === 'success' ||
      status === 'success' || 
      status === 'SUCCESS' || 
      status === 'Success' ||
      status === '1' ||
      status === 1 ||
      paymentData.statuscode === '1' ||
      paymentData.statusCode === '1' ||
      paymentData.status_code === '1' ||
      paymentData.result === 'success';

    // Get frontend URL from environment or default to localhost
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Redirect to React route with transaction ID (similar to Razorpay handler redirect)
    if (isSuccess) {
      console.log("✅ Payment successful, redirecting to:", `${frontendUrl}/bus-payment-success?txnid=${txnid}`);
      return res.redirect(`${frontendUrl}/bus-payment-success?txnid=${txnid}`);
    } else {
      console.log("❌ Payment failed or status unclear, redirecting to:", `${frontendUrl}/bus-payment-failure?txnid=${txnid}`);
      console.log("   Status values:", { statusFromQuery, statusFromBody, finalStatus: status });
      return res.redirect(`${frontendUrl}/bus-payment-failure?txnid=${txnid}`);
    }
  } catch (error) {
    console.error("❌ Easebuzz Callback Error:", error.message);
    console.error("   Error Stack:", error.stack);
    console.error("   Request Details:", {
      method: req.method,
      url: req.url,
      body: req.body,
      query: req.query
    });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const txnid = req.body?.txnid || req.query?.txnid || '';
    
    try {
      return res.redirect(`${frontendUrl}/bus-payment-failure?txnid=${txnid}`);
    } catch (redirectError) {
      console.error("❌ Failed to redirect:", redirectError.message);
      return res.status(500).json({ 
        error: 'Payment callback error', 
        message: error.message,
        txnid: txnid
      });
    }
  }
};