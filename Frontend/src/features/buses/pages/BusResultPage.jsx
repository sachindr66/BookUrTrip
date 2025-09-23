

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchBusBook } from '../busesSlice'

const BusPaymentPages = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get data from Redux store and location state
  const { busBlockData, status, error } = useSelector((state) => state.buses)
  const { passengers, traceId, tokenId, boardingPointId, droppingPointId, endUserIp, resultIndex } = location.state || {}

  useEffect(() => {
    console.log("Bus block data from Redux:", busBlockData)
    console.log("Navigation state data:", location.state)
  }, [busBlockData, location.state])

  // Automatically proceed to booking when component mounts
  useEffect(() => {
    if (busBlockData && !isProcessing) {
      handleProceedToBooking()
    }
  }, [busBlockData])

  const handleProceedToBooking = async () => {
  if (!busBlockData) {
    alert('No booking data found. Please go back and try again.')
    return
  }

  setIsProcessing(true)
  
  try {
    // Use the complete busBlockData instead of transforming passengers
    const bookingData = {
      Passenger: busBlockData.BlockResult.Passenger,  // Use the passengers from block response
      TokenId: tokenId,
      TraceId: traceId,
      EndUserIp: endUserIp,
      ResultIndex: resultIndex,
      BoardingPointId: boardingPointId,
      DroppingPointId: droppingPointId
    }

    console.log("Sending booking data:", bookingData)
    
    // Dispatch the booking action
    const result = await dispatch(fetchBusBook(bookingData)).unwrap()
    console.log("Booking successful:", result)
    
    // Navigate to confirmation page with booking data
    navigate('/busConfirmationPage', {
      state: {
        busBookData: result
      }
    })
    
  } catch (error) {
    console.error("Booking failed:", error)
    alert('Booking failed. Please try again.')
  } finally {
    setIsProcessing(false)
  }
}

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Processing Booking</h1>

      <div className="bg-white border rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Completing your booking...</h2>
        <p className="text-gray-600 mb-6">Please wait while we confirm your reservation.</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="font-medium text-blue-800 mb-2">Booking Summary</h3>
          <p className="text-sm text-blue-700">
            {passengers?.length || 0} passenger(s) • Seat booking in progress
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
            <h3 className="font-medium mb-2">Booking Error</h3>
            <p>{error.message || 'Failed to process booking. Please try again.'}</p>
            <button 
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={handleProceedToBooking}
            >
              Retry Booking
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusPaymentPages


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

//   // Automatically proceed to booking when component mounts
//   useEffect(() => {
//     if (busBlockData && !isProcessing) {
//       handleProceedToBooking()
//     }
//   }, [busBlockData])

//   const handleProceedToBooking = async () => {
//   if (!busBlockData) {
//     alert('No booking data found. Please go back and try again.')
//     return
//   }

//   setIsProcessing(true)
  
//   try {
//     // Use the complete busBlockData instead of transforming passengers
//     const bookingData = {
//       Passenger: busBlockData.BlockResult.Passenger,  // Use the passengers from block response
//       TokenId: tokenId,
//       TraceId: traceId,
//       EndUserIp: endUserIp,
//       ResultIndex: resultIndex,
//       BoardingPointId: boardingPointId,
//       DroppingPointId: droppingPointId
//     }

//     console.log("Sending booking data:", bookingData)
    
//     // Dispatch the booking action
//     const result = await dispatch(fetchBusBook(bookingData)).unwrap()
//     console.log("Booking successful:", result)
    
//     // Navigate to confirmation page with booking data
//     navigate('/busConfirmationPage', {
//       state: {
//         busBookData: result
//       }
//     })
    
//   } catch (error) {
//     console.error("Booking failed:", error)
//     alert('Booking failed. Please try again.')
//   } finally {
//     setIsProcessing(false)
//   }
// }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Processing Booking</h1>

//       <div className="bg-white border rounded-lg p-8 text-center">
//         <div className="flex justify-center mb-6">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
        
//         <h2 className="text-xl font-semibold mb-4">Completing your booking...</h2>
//         <p className="text-gray-600 mb-6">Please wait while we confirm your reservation.</p>
        
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
//           <h3 className="font-medium text-blue-800 mb-2">Booking Summary</h3>
//           <p className="text-sm text-blue-700">
//             {passengers?.length || 0} passenger(s) • Seat booking in progress
//           </p>
//         </div>

//         {error && (
//           <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md mx-auto">
//             <h3 className="font-medium mb-2">Booking Error</h3>
//             <p>{error.message || 'Failed to process booking. Please try again.'}</p>
//             <button 
//               className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//               onClick={handleProceedToBooking}
//             >
//               Retry Booking
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default BusPaymentPage




// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { fetchBusBook } from '../busesSlice';
// import DummyPayment from '../components/DummyPayment';

// const BusPaymentPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { busBlockData, status } = useSelector((state) => state.buses);
//   const { tokenId, traceId } = useSelector((state) => state.buses);
  
//   // Extract ALL data from location state
//   const { 
//     selectedBus, 
//     selectedBoardingPoint, 
//     selectedDroppingPoint,
//     resultIndex, // Get resultIndex directly from navigation state
//     boardingPointId,
//     droppingPointId
//   } = location.state || {};
  
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [showPayment, setShowPayment] = useState(false);

//   // Calculate total amount
//   useEffect(() => {
//     if (busBlockData?.BlockResult?.Passenger) {
//       const total = busBlockData.BlockResult.Passenger.reduce((sum, passenger) => {
//         return sum + (passenger.Seat?.Price?.PublishedPrice || 0);
//       }, 0);
//       setPaymentAmount(total);
//     }
//   }, [busBlockData]);

//   // Automatically show payment UI when component loads
//   useEffect(() => {
//     if (busBlockData) {
//       setShowPayment(true);
//     }
//   }, [busBlockData]);

//   const handleProceedToBooking = async () => {
//     try {
//       // Check if busBlockData exists and has the required structure
//       if (!busBlockData || !busBlockData.BlockResult) {
//         alert('Booking data not found. Please go back and try again.');
//         return;
//       }

//       // Use multiple fallback options for ResultIndex
//       const finalResultIndex = 
//         resultIndex || // From navigation state
//         selectedBus?.ResultIndex || // From selectedBus object
//         busBlockData.BlockResult.ResultIndex || // From block response
//         0;

//       // Use multiple fallback options for boarding/dropping points
//       const finalBoardingPointId = 
//         boardingPointId || // From navigation state
//         selectedBoardingPoint?.CityPointIndex || // From selectedBoardingPoint object
//         1;

//       const finalDroppingPointId = 
//         droppingPointId || // From navigation state
//         selectedDroppingPoint?.CityPointIndex || // From selectedDroppingPoint object
//         1;

//       const bookingData = {
//         Passenger: busBlockData.BlockResult.Passenger || [],
//         TokenId: tokenId,
//         TraceId: traceId,
//         EndUserIp: '192.168.1.1',
//         ResultIndex: finalResultIndex,
//         BoardingPointId: finalBoardingPointId,
//         DroppingPointId: finalDroppingPointId
//       };

//       console.log("Final booking data:", bookingData);

//       // Validate that all required fields are present and valid
//       const requiredFields = [
//         { field: 'Passenger', isValid: (val) => Array.isArray(val) && val.length > 0 },
//         { field: 'TokenId', isValid: (val) => val && val !== '' },
//         { field: 'TraceId', isValid: (val) => val && val !== '' },
//         { field: 'EndUserIp', isValid: (val) => val && val !== '' },
//         { field: 'ResultIndex', isValid: (val) => val !== undefined && val !== null && val !== 0 },
//         { field: 'BoardingPointId', isValid: (val) => val !== undefined && val !== null },
//         { field: 'DroppingPointId', isValid: (val) => val !== undefined && val !== null }
//       ];
      
//       const missingFields = requiredFields.filter(({ field, isValid }) => !isValid(bookingData[field]));
      
//       if (missingFields.length > 0) {
//         console.error("Missing or invalid fields:", missingFields.map(f => f.field));
//         alert(`Missing required booking information: ${missingFields.map(f => f.field).join(', ')}`);
//         return;
//       }

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

//   if (!busBlockData) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h1 className="text-3xl font-bold mb-4">Loading...</h1>
//         <p>Preparing your payment details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-2xl">
//       <h1 className="text-3xl font-bold mb-8 text-center">Complete Payment</h1>

//       {/* Debug info - remove in production */}
//       <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
//         <p>Debug: ResultIndex = {resultIndex || selectedBus?.ResultIndex || 'Not found'}</p>
//         <p>BoardingPointId = {boardingPointId || selectedBoardingPoint?.CityPointIndex || 'Not found'}</p>
//       </div>

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

//       {/* Dummy Payment Gateway - Only show when ready */}
//       {showPayment && (
//         <DummyPayment
//           amount={paymentAmount}
//           onSuccess={handlePaymentSuccess}
//           onFailure={handlePaymentFailure}
//         />
//       )}

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