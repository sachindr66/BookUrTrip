// DummyPayment.jsx
import React, { useState } from 'react';

const DummyPayment = ({ amount, onSuccess, onFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      // Simulate 90% success rate for testing
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        onSuccess();
      } else {
        onFailure("Payment failed - Please try again");
      }
      setIsProcessing(false);
    }, 2000);
  };

  const handleUpiPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      alert(`UPI Payment of ₹${amount} successful!`);
      onSuccess();
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">💳 Payment Gateway</h3>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-700">
          <strong>Demo Mode:</strong> This is a dummy payment gateway. No real transactions will occur.
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="upi">UPI</option>
          <option value="netbanking">Net Banking</option>
          <option value="wallet">Wallet</option>
        </select>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-700">
            UPI ID: yourname@upi | Amount: ₹{amount}
          </p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Test Tips:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use any card number (e.g., 4111 1111 1111 1111)</li>
          <li>• Any future expiry date (e.g., 12/25)</li>
          <li>• Any 3-digit CVV (e.g., 123)</li>
          <li>• 90% success rate for testing</li>
        </ul>
      </div>

      <button
        onClick={paymentMethod === 'upi' ? handleUpiPayment : handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      {paymentMethod === 'card' && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-center">
          <span className="text-gray-600">Test Card: 4111 1111 1111 1111 | Exp: 12/25 | CVV: 123</span>
        </div>
      )}
    </div>
  );
};

export default DummyPayment;



// BusPaymentPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { fetchBusBook } from '../busesSlice';
// import DummyPayment from '../components/DummyPayment';

// const BusPaymentPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { busBlockData, status } = useSelector((state) => state.buses);
//   const [paymentAmount, setPaymentAmount] = useState(0);

//   // Calculate total amount
//   useEffect(() => {
//     if (busBlockData?.BlockResult?.Passenger) {
//       const total = busBlockData.BlockResult.Passenger.reduce((sum, passenger) => {
//         return sum + (passenger.Seat?.Price?.PublishedPrice || 0);
//       }, 0);
//       setPaymentAmount(total);
//     }
//   }, [busBlockData]);

//   const handleProceedToBooking = async () => {
//     try {
//       const bookingData = {
//         Passenger: busBlockData.BlockResult.Passenger,
//         TokenId: busBlockData.BlockResult.TokenId,
//         TraceId: busBlockData.BlockResult.TraceId,
//         EndUserIp: '192.168.1.1',
//         ResultIndex: busBlockData.BlockResult.ResultIndex,
//         BoardingPointId: 1,
//         DroppingPointId: 1
//       };

//       const result = await dispatch(fetchBusBook(bookingData)).unwrap();
      
//       navigate('/busConfirmationPage', {
//         state: { busBookData: result }
//       });
      
//     } catch (error) {
//       console.error("Booking failed:", error);
//       alert('Booking failed. Please try again.');
//     }
//   };

//   const handlePaymentSuccess = () => {
//     handleProceedToBooking();
//   };

//   const handlePaymentFailure = (errorMessage) => {
//     alert(errorMessage);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>

//       {/* Payment Summary */}
//       <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
//         <div className="space-y-2 text-gray-700">
//           <div className="flex justify-between">
//             <span>Ticket Amount:</span>
//             <span>₹{paymentAmount}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Convenience Fee:</span>
//             <span>₹0</span>
//           </div>
//           <div className="flex justify-between border-t pt-2 mt-2 font-bold text-lg">
//             <span>Total Amount:</span>
//             <span className="text-green-600">₹{paymentAmount}</span>
//           </div>
//         </div>
//       </div>

//       {/* Dummy Payment Gateway */}
//       <DummyPayment
//         amount={paymentAmount}
//         onSuccess={handlePaymentSuccess}
//         onFailure={handlePaymentFailure}
//       />

//       {/* Status Message */}
//       {status === 'loading' && (
//         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-center">
//           <p className="text-blue-700">Processing your booking...</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BusPaymentPage;