import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { busBlock, addPassenger, removePassenger, updatePassenger } from '../busesSlice';
import { useNavigate, useLocation } from 'react-router-dom'

const BusFormDetailsPage = () => {

  const [showGSTDetails, setShowGSTDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { tokenId, traceId, passengers, status } = useSelector((state) => state.buses)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get data from navigation state
  const location = useLocation()
  const selectedBoardingPoint = location.state?.selectedBoardingPoint
  const selectedDroppingPoint = location.state?.selectedDroppingPoint
  const selectedSeats = location.state?.selectedSeats || []
  const selectedSeatData = location.state?.selectedSeatData || []
  const selectedBus = location.state?.selectedBus

  // Debug: Log the values we're getting from Redux
  console.log('Redux state values:', {
    tokenId,
    traceId,
    passengersCount: passengers?.length
  })

  // Debug: Log navigation state
  console.log('Navigation state:', {
    selectedBus,
    selectedBoardingPoint,
    selectedDroppingPoint,
    selectedSeats,
    selectedSeatData
  })

  // Assign seats to passengers when component loads
  useEffect(() => {
    if (selectedSeatData.length > 0 && passengers.length > 0) {
      selectedSeatData.forEach((seatData, index) => {
        if (passengers[index]) {
          dispatch(updatePassenger({
            index: index,
            field: 'SeatId',
            value: seatData.SeatIndex || seatData.SeatId || ''
          }))
          dispatch(updatePassenger({
            index: index,
            field: 'SeatName',
            value: seatData.SeatName || ''
          }))
        }
      })
    }
  }, [selectedSeatData, passengers.length, dispatch])

  // Adjust passenger count to match selected seats
  useEffect(() => {
    if (selectedSeats.length > 0 && passengers.length !== selectedSeats.length) {
      const currentCount = passengers.length
      const targetCount = selectedSeats.length

      if (targetCount > currentCount) {
        // Add passengers
        for (let i = currentCount; i < targetCount; i++) {
          dispatch(addPassenger())
        }
      } else if (targetCount < currentCount) {
        // Remove passengers
        for (let i = currentCount - 1; i >= targetCount; i--) {
          dispatch(removePassenger(i))
        }
      }
    }
  }, [selectedSeats.length, passengers.length, dispatch])

  // Handler functions for passenger management
  const handleAddPassenger = () => {
    dispatch(addPassenger());
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      dispatch(removePassenger(index));
    }
  };

  const handlePassengerChange = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
    // Clear any existing errors for this field
    if (formErrors[`passenger_${index}_${field}`]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`passenger_${index}_${field}`];
        return newErrors;
      });
    }
  };

  const handleClickProceedToPayment = () => {
    navigate('/busPaymentPage', {
      state: {
        passengers: passengers,
        traceId: traceId,
        tokenId: tokenId,
        boardingPointId: selectedBoardingPoint?.CityPointIndex || 1,
        droppingPointId: selectedDroppingPoint?.CityPointIndex || 1,
        endUserIp: '192.168.1.1',
        resultIndex: selectedBus?.ResultIndex || 0,
        selectedBoardingPoint: selectedBoardingPoint,
        selectedDroppingPoint: selectedDroppingPoint,
        selectedSeats: selectedSeats,
        selectedSeatData: selectedSeatData
      }
    })
  }


  // Form validation
  const validateForm = () => {
    const errors = {};

    passengers.forEach((passenger, index) => {
      if (!passenger.Title) errors[`passenger_${index}_Title`] = 'Title is required';
      if (!passenger.FirstName) errors[`passenger_${index}_FirstName`] = 'First name is required';
      if (!passenger.LastName) errors[`passenger_${index}_LastName`] = 'Last name is required';
      if (!passenger.Age) errors[`passenger_${index}_Age`] = 'Age is required';
      if (!passenger.Gender) errors[`passenger_${index}_Gender`] = 'Gender is required';
      if (!passenger.Mobile) errors[`passenger_${index}_Mobile`] = 'Mobile is required';
      if (!passenger.Email) errors[`passenger_${index}_Email`] = 'Email is required';
      if (!passenger.Address) errors[`passenger_${index}_Address`] = 'Address is required';

      // Email validation
      if (passenger.Email && !/\S+@\S+\.\S+/.test(passenger.Email)) {
        errors[`passenger_${index}_Email`] = 'Please enter a valid email';
      }

      // Mobile validation (basic)
      if (passenger.Mobile && !/^\d{10}$/.test(passenger.Mobile)) {
        errors[`passenger_${index}_Mobile`] = 'Please enter a valid 10-digit mobile number';
      }
    });

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Validate required API fields
    if (!tokenId || !traceId) {
      alert('Missing required booking information. Please go back and try again.');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Transform passengers to match backend expected format
      const transformedPassengers = passengers.map(passenger => {
        console.log('Transforming passenger:', passenger);
        const transformed = {
          Title: passenger.Title,
          FirstName: passenger.FirstName,
          LastName: passenger.LastName,
          Age: passenger.Age,
          Gender: passenger.Gender,
          Phoneno: passenger.Mobile, // Backend expects Phoneno, not Mobile
          Email: passenger.Email,
          Address: passenger.Address,
          Seat: {
            SeatIndex: passenger.SeatId, // Backend expects SeatIndex in Seat object
            SeatName: passenger.SeatName
          }
        };
        console.log('Transformed passenger:', transformed);
        return transformed;
      });

      const data = {
        EndUserIp: '192.168.1.1',
        ResultIndex: selectedBus?.ResultIndex || 0,
        TraceId: traceId,
        TokenId: tokenId,
        BoardingPointId: selectedBoardingPoint?.CityPointIndex || 1,
        DroppingPointId: selectedDroppingPoint?.CityPointIndex || 1,
        Passenger: transformedPassengers
      };

      console.log('Sending busBlock data:', data);
      console.log('Original passenger data:', passengers);
      console.log('Transformed passenger data:', transformedPassengers);
      console.log('Data being sent to Redux:', {
        EndUserIp: data.EndUserIp,
        ResultIndex: data.ResultIndex,
        TraceId: data.TraceId,
        TokenId: data.TokenId,
        BoardingPointId: data.BoardingPointId,
        DroppingPointId: data.DroppingPointId,
        Passenger: data.Passenger
      });

      await dispatch(busBlock(data)).unwrap();
      console.log('Bus block successful');

      // Navigate to payment page after successful bus block
      handleClickProceedToPayment();
    } catch (error) {
      console.error('Bus block failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Journey Summary */}
      {(selectedBoardingPoint || selectedDroppingPoint || selectedSeats.length > 0) && (
        <div className="border rounded-2xl shadow p-6 bg-gradient-to-r from-blue-50 to-green-50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <i className="fas fa-route text-blue-600"></i>
            Journey Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Boarding Point */}
            {selectedBoardingPoint && (
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt"></i>
                  Boarding Point
                </h4>
                <p className="text-sm text-blue-700 font-medium">{selectedBoardingPoint.CityPointLocation}</p>
                <p className="text-xs text-blue-600">{selectedBoardingPoint.CityPointLandmark}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedBoardingPoint.CityPointAddress}</p>
              </div>
            )}

            {/* Dropping Point */}
            {selectedDroppingPoint && (
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <i className="fas fa-flag-checkered"></i>
                  Dropping Point
                </h4>
                <p className="text-sm text-green-700 font-medium">{selectedDroppingPoint.CityPointLocation}</p>
                <p className="text-xs text-green-600">{selectedDroppingPoint.CityPointLandmark}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedDroppingPoint.CityPointAddress}</p>
              </div>
            )}

            {/* Selected Seats */}
            {selectedSeats.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                  <i className="fas fa-chair"></i>
                  Selected Seats
                </h4>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedSeats.map((seat, index) => (
                    <span key={seat} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                      {seat}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Total: {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Passenger Management Header */}
      <div className="border rounded-2xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <i className="fas fa-users"></i> Passenger Details ({passengers.length})
          </h3>
          <button
            type="button"
            onClick={handleAddPassenger}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> Add Passenger
          </button>
        </div>

        {/* Dynamic Passenger Forms */}
        {passengers.map((passenger, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">Passenger {index + 1}</h4>
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePassenger(index)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <i className="fas fa-trash"></i> Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium">Title *</label>
                <select
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Title`] ? 'border-red-500' : ''}`}
                  value={passenger.Title}
                  onChange={(e) => handlePassengerChange(index, 'Title', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                </select>
                {formErrors[`passenger_${index}_Title`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Title`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">First Name *</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_FirstName`] ? 'border-red-500' : ''}`}
                  value={passenger.FirstName}
                  onChange={(e) => handlePassengerChange(index, 'FirstName', e.target.value)}
                />
                {formErrors[`passenger_${index}_FirstName`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_FirstName`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name *</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_LastName`] ? 'border-red-500' : ''}`}
                  value={passenger.LastName}
                  onChange={(e) => handlePassengerChange(index, 'LastName', e.target.value)}
                />
                {formErrors[`passenger_${index}_LastName`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_LastName`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Age *</label>
                <input
                  type="number"
                  placeholder="Age"
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Age`] ? 'border-red-500' : ''}`}
                  value={passenger.Age}
                  onChange={(e) => handlePassengerChange(index, 'Age', e.target.value)}
                />
                {formErrors[`passenger_${index}_Age`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Age`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Gender *</label>
                <select
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Gender`] ? 'border-red-500' : ''}`}
                  value={passenger.Gender}
                  onChange={(e) => handlePassengerChange(index, 'Gender', e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors[`passenger_${index}_Gender`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Gender`]}</p>
                )}
              </div>
            </div>

            {/* Contact Details for each passenger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium">Mobile *</label>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Mobile`] ? 'border-red-500' : ''}`}
                  value={passenger.Mobile}
                  onChange={(e) => handlePassengerChange(index, 'Mobile', e.target.value)}
                />
                {formErrors[`passenger_${index}_Mobile`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Mobile`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Email`] ? 'border-red-500' : ''}`}
                  value={passenger.Email}
                  onChange={(e) => handlePassengerChange(index, 'Email', e.target.value)}
                />
                {formErrors[`passenger_${index}_Email`] && (
                  <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Email`]}</p>
                )}
              </div>
            </div>

            {/* Address for each passenger */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Address *</label>
              <input
                type="text"
                placeholder="Enter address"
                className={`mt-1 w-full border rounded-lg p-2 ${formErrors[`passenger_${index}_Address`] ? 'border-red-500' : ''}`}
                value={passenger.Address}
                onChange={(e) => handlePassengerChange(index, 'Address', e.target.value)}
              />
              {formErrors[`passenger_${index}_Address`] && (
                <p className="text-red-500 text-xs mt-1">{formErrors[`passenger_${index}_Address`]}</p>
              )}
            </div>

            {/* Seat Information */}
            {(passenger.SeatId || passenger.SeatName) && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-purple-800 mb-2">Assigned Seat</h5>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 font-medium">Seat:</span> {passenger.SeatName}
                  </div>
                  <div>
                    <span className="text-purple-600 font-medium">ID:</span> {passenger.SeatId}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GST Details Section */}
      <div className="border rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-receipt"></i> Additional Details
        </h3>

        {/* GST Toggle */}
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGSTDetails}
              onChange={(e) => setShowGSTDetails(e.target.checked)}
              className="h-4 w-4"
            />
            Add GST Details (Optional)
          </label>
        </div>

        {showGSTDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">GST Number</label>
              <input
                type="text"
                placeholder="Enter GST number"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                placeholder="Enter company name"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting || status === 'loading'}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isSubmitting || status === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
        >
          {isSubmitting || status === 'loading' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </button>

        {/* Error Display */}
        {status === 'failed' && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-medium">Booking Failed</p>
            <p className="text-sm">Please try again or contact support if the problem persists.</p>
          </div>
        )}
      </div>
    </form>
  );
};



export default BusFormDetailsPage
