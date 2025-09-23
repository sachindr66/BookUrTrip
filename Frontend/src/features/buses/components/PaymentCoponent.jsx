

// PaymentComponent.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRazorpayOrder, verifyPayment, clearPaymentState } from './paymentSlice';

const PaymentComponent = ({ amount, onSuccess, onFailure }) => {
  const dispatch = useDispatch();
  const { orderId, paymentStatus, verificationStatus, error } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(createRazorpayOrder(amount));
  }, [dispatch, amount]);

  useEffect(() => {
    if (orderId) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Your Bus Booking",
        description: "Bus Ticket Payment",
        order_id: orderId,
        handler: function (response) {
          dispatch(verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }));
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function (response) {
        onFailure(response.error);
      });
    }
  }, [orderId, amount, dispatch, onSuccess, onFailure]);

  useEffect(() => {
    if (verificationStatus === "succeeded") {
      onSuccess();
    } else if (verificationStatus === "failed") {
      onFailure(error);
    }
  }, [verificationStatus, error, onSuccess, onFailure]);

  if (paymentStatus === "loading") {
    return <div>Processing payment...</div>;
  }

  return null;
};

export default PaymentComponent;
















// // BusPaymentPage.jsx (updated)
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import PaymentComponent from '../components/PaymentComponent';

// const BusPaymentPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { busBlockData } = useSelector((state) => state.buses);
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState(0);

//   // Calculate total amount from busBlockData
//   useEffect(() => {
//     if (busBlockData?.BlockResult?.Passenger) {
//       const total = busBlockData.BlockResult.Passenger.reduce((sum, passenger) => {
//         return sum + (passenger.Seat?.Price?.PublishedPrice || 0);
//       }, 0);
//       setPaymentAmount(total);
//     }
//   }, [busBlockData]);

//   const handlePaymentSuccess = () => {
//     // Proceed with booking after successful payment
//     handleProceedToBooking();
//   };

//   const handlePaymentFailure = (error) => {
//     console.error("Payment failed:", error);
//     alert('Payment failed. Please try again.');
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Payment</h1>

//       <div className="bg-white border rounded-lg p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
//         <div className="space-y-2">
//           <div className="flex justify-between">
//             <span>Total Amount:</span>
//             <span className="font-bold">₹{paymentAmount}</span>
//           </div>
//         </div>
//       </div>

//       <button
//         onClick={() => setShowPayment(true)}
//         className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
//       >
//         Proceed to Pay ₹{paymentAmount}
//       </button>

//       {showPayment && (
//         <PaymentComponent
//           amount={paymentAmount}
//           onSuccess={handlePaymentSuccess}
//           onFailure={handlePaymentFailure}
//         />
//       )}
//     </div>
//   );
// };

// export default BusPaymentPage;