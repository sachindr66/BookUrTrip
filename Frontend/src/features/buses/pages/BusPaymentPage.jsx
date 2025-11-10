import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchBusBook } from "../busesSlice";

const BusPaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);

  const { busBlockData } = useSelector((state) => state.buses);
  const { passengers, traceId, tokenId, boardingPointId, droppingPointId, endUserIp, resultIndex } =
    location.state || {};

  const handleEasebuzzPayment = async () => {
    if (!busBlockData) {
      alert("Booking data missing. Please go back and try again.");
      return;
    }

    try {
      setIsProcessing(true);

      // ✅ Generate unique transaction ID
      const txnid = "TXN" + Date.now();

      // ✅ Call your backend to get payment access key
      const response = await axios.post("http://localhost:5000/easebuzzPayment/Initiate_Payment", {
        txnid,
        amount: "100.00", // You can use dynamic price
        productinfo: "Bus Ticket",
        firstname: passengers?.[0]?.FirstName || "User",
        email: "test@example.com",
        phone: "9876543210",
        surl: "http://localhost:5173/payment-success", // After payment success
        furl: "http://localhost:5173/payment-failure", // If failed
      });

      if (response.data?.success && response.data?.data?.data) {
        const accessKey = response.data.data.data;
        const paymentUrl = `https://testpay.easebuzz.in/pay/${accessKey}`;

        // ✅ Redirect user to Easebuzz payment gateway
        window.location.href = paymentUrl;
      } else {
        alert("Failed to initiate payment. Try again.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Payment initiation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Bus Payment Page</h1>

      <div className="bg-white border rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
        <p className="text-gray-600 mb-6">Click the button below to proceed to secure payment.</p>

        <button
          onClick={handleEasebuzzPayment}
          disabled={isProcessing}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Pay & Book Now"}
        </button>
      </div>
    </div>
  );
};

export default BusPaymentPage;


















// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { fetchBusBook } from '../busesSlice'

// const BusPaymentPage = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()
  
//   const [isProcessing, setIsProcessing] = useState(false)
  
//   // Get data from Redux store and location state
//   const { busBlockData, status, error } = useSelector((state) => state.buses)
//   const { passengers, traceId, tokenId, boardingPointId, droppingPointId, endUserIp, resultIndex } = location.state || {}

//   useEffect(() => {
//     console.log("Bus block data from Redux:", busBlockData)
//     console.log("Navigation state data:", location.state)
//   }, [busBlockData, location.state])

//   const handleProceedToPayment = async () => {
//     if (!busBlockData) {
//       alert('No booking data found. Please go back and try again.')
//       return
//     }

//     setIsProcessing(true)
    
//     try {
//       // Prepare booking data - use the data from busBlock response
//       const bookingData = {
//         Passenger: busBlockData.Passenger || passengers,
//         TokenId: tokenId,
//         TraceId: traceId,
//         EndUserIp: endUserIp,
//         ResultIndex: resultIndex,
//         BoardingPointId: boardingPointId,
//         DroppingPointId: droppingPointId
//       }

//       console.log("Sending booking data:", bookingData)
      
//       // Dispatch the booking action
//       const result = await dispatch(fetchBusBook(bookingData)).unwrap()
//       console.log("Booking successful:", result)
      
//       // Navigate to confirmation page with booking data
//       navigate('/busConfirmationPage', {
//         state: {
//           busBookData: result
//         }
//       })
      
//     } catch (error) {
//       console.error("Booking failed:", error)
//       alert('Payment processing failed. Please try again.')
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

//       {/* Payment Form Placeholder */}
//       <div className="bg-white border rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Card Number</label>
//             <input type="text" placeholder="1234 5678 9012 3456" className="w-full border rounded-lg p-3 mt-1" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium">Expiry Date</label>
//               <input type="text" placeholder="MM/YY" className="w-full border rounded-lg p-3 mt-1" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">CVV</label>
//               <input type="text" placeholder="123" className="w-full border rounded-lg p-3 mt-1" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium">Card Holder Name</label>
//             <input type="text" placeholder="John Doe" className="w-full border rounded-lg p-3 mt-1" />
//           </div>
//         </div>
//       </div>

//       <div className="text-center">
//         <button 
//           className="btn-primary w-full py-3 text-lg"
//           onClick={handleProceedToPayment}
//           disabled={isProcessing || status === 'loading'}
//         >
//           {isProcessing ? 'Processing Payment...' : 'Confirm Payment'}
//         </button>
        
//         {error && (
//           <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             Error: {error.message || 'Payment failed'}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default BusPaymentPage












// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { fetchBusBook } from '../busesSlice'


// const BusPaymentPage = () => {

//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const location = useLocation()

//   // const { passengers, traceId, tokenId, boardingPointId, droppingPointId, endUserIp, resultIndex } = location.state || {}
//   const { passengers, traceId, tokenId, boardingPointId, droppingPointId, endUserIp, resultIndex, busBlockData, } = useSelector((state) => state.buses)
//   console.log("bus block payload data", busBlockData)
  


//   const navigateBusConfirmation = () => {

  
//         navigate('/busConfirmationPage',{
//           state: {
//             busBookData: busBookData,
//           },
//         })
      
//   }


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

//       {/* Debug Info - Remove in production */}
//       <div className="bg-gray-100 p-4 rounded-lg mb-6">
//         <h3 className="font-semibold mb-2">Debug Information:</h3>
//         <pre className="text-sm">
//           {JSON.stringify({
//             passengers,
//             traceId,
//             tokenId,
//             boardingPointId,
//             droppingPointId,
//             endUserIp,
//             resultIndex
//           }, null, 2)}
//         </pre>
//       </div>

//       {/* Passenger Summary */}
//       {passengers && passengers.length > 0 && (
//         <div className="bg-white border rounded-lg p-6 mb-6">
//           <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
//           {passengers.map((passenger, index) => (
//             <div key={index} className="border-b pb-4 mb-4 last:border-b-0">
//               <h3 className="font-medium">Passenger {index + 1}</h3>
//               <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
//                 <div>
//                   <span className="font-medium">Name:</span> {passenger.Title} {passenger.FirstName} {passenger.LastName}
//                 </div>
//                 <div>
//                   <span className="font-medium">Age:</span> {passenger.Age}
//                 </div>
//                 <div>
//                   <span className="font-medium">Gender:</span> {passenger.Gender}
//                 </div>
//                 <div>
//                   <span className="font-medium">Mobile:</span> {passenger.Mobile}
//                 </div>
//                 <div>
//                   <span className="font-medium">Email:</span> {passenger.Email}
//                 </div>
//                 <div>
//                   <span className="font-medium">Address:</span> {passenger.Address}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Payment Form Placeholder */}
//       <div className="bg-white border rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
//         <p className="text-gray-600">Payment form will be implemented here...</p>
//       </div>

//       <div>
//         <button className='btn-primary' onClick={navigateBusConfirmation} >Proceed Payment</button>
//       </div>
//     </div>
//   )
// }

// export default BusPaymentPage
