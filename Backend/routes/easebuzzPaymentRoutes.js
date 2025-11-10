 import express from "express";
 import { easebuzzPayment, easebuzzPaymentCallback } from "../controllers/easebuzzPayment.js";
  
 const paymentroutes= express.Router()


 paymentroutes.post('/easebuzzPayment/Initiate_Payment',easebuzzPayment,)
 paymentroutes.post('/easebuzzPayment/easebuzz_Payment_Callback',easebuzzPaymentCallback,)
 paymentroutes.get('/easebuzzPayment/easebuzz_Payment_Callback',easebuzzPaymentCallback,)

export default paymentroutes




// import axios from "axios";
// import crypto from "crypto";
// import dotenv from "dotenv";
// dotenv.config();

// export const easebuzzPaymentController = async (req, res) => {
//   try {
//     const { txnid, amount, productinfo, firstname, email, phone } = req.body;

//     // ✅ Validate required fields
//     if (!txnid || !amount || !productinfo || !firstname || !email || !phone) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const key = process.env.EASEBUZZ_KEY;
//     const salt = process.env.EASEBUZZ_SALT;
//     const baseUrl = "https://testpay.easebuzz.in/payment/initiateLink"; // UAT / Sandbox

//     // ✅ Create hash string
//     const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
//     const hash = crypto.createHash("sha512").update(hashString).digest("hex");

//     // ✅ Form data
//     const formData = new URLSearchParams();
//     formData.append("key", key);
//     formData.append("txnid", txnid);
//     formData.append("amount", amount);
//     formData.append("productinfo", productinfo);
//     formData.append("firstname", firstname);
//     formData.append("phone", phone);
//     formData.append("email", email);

//     // ✅ Redirect URLs (important)
//     formData.append("surl", "http://localhost:3002/payment-success");
//     formData.append("furl", "http://localhost:3002/payment-failed");

//     formData.append("hash", hash);

//     // Optional fields — keep empty
//     for (let i = 1; i <= 10; i++) {
//       formData.append(`udf${i}`, "");
//     }

//     // ✅ Send request to Easebuzz
//     const response = await axios.post(baseUrl, formData, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//         Accept: "application/json",
//       },
//     });

//     const accessKey = response.data?.data?.access_key;

//     if (!accessKey) {
//       return res.status(400).json({
//         success: false,
//         message: "Access key not returned from Easebuzz",
//         data: response.data,
//       });
//     }

//     // ✅ Send access key to frontend
//     res.status(200).json({
//       success: true,
//       message: "Easebuzz Payment Initiated Successfully",
//       access_key: accessKey,
//     });
//   } catch (error) {
//     console.error("Easebuzz Error:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Payment initiation failed",
//       details: error.message,
//     });
//   }
// };
