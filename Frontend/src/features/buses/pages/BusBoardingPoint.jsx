import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const BusBoardingPoint = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate()

  // State for selected points
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState(null)
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState(null)

  const selectedBus = location.state?.selectedBus;
  const traceId = location.state?.traceId;
  const selectedSeats = location.state?.selectedSeats;
  const selectedSeatData = location.state?.selectedSeatData;

  const { BoardingPointsDetails = [], DropingPointsDetails = [], tokenId, status, error } = useSelector((state) => state.buses);

  const formdetails = () => {
    if (!selectedBoardingPoint || !selectedDroppingPoint) {
      alert('Please select both boarding and dropping points')
      return
    }

    navigate('/busFormDetailsPage', {
      state: {
        selectedBus,
        traceId,
        tokenId,
        selectedSeats,
        selectedSeatData,
        selectedBoardingPoint,
        selectedDroppingPoint
      }
    })
  }

  // useEffect(() => {
  //   if (!selectedBus || !traceId || !tokenId || status === 'loading') return;
  //   const BoardingParams = {
  //     EndUserIp: '192.168.1.1',
  //     ResultIndex: selectedBus.ResultIndex,
  //     TraceId: traceId,
  //     TokenId: tokenId,
  //   };
  //   dispatch(busBoardingPoint(BoardingParams));
  // }, [dispatch, tokenId, selectedBus, traceId, status]);

  console.log('Boarding pages Boardingpoints', BoardingPointsDetails);
  console.log('Boarding pages Dropingpoints', DropingPointsDetails);

  if (status === 'loading') return <p>Loading boarding points...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Boarding & Dropping Points</h1>
          <p className="text-gray-600">Choose your preferred boarding and dropping locations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boarding Points Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-blue-600"></i>
              Boarding Points
            </h2>

            {BoardingPointsDetails.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No boarding points available.</p>
            ) : (
              <div className="space-y-3">
                {BoardingPointsDetails.map((point) => (
                  <div
                    key={point.CityPointIndex}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedBoardingPoint?.CityPointIndex === point.CityPointIndex
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    onClick={() => setSelectedBoardingPoint(point)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${selectedBoardingPoint?.CityPointIndex === point.CityPointIndex
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                        }`}>
                        {selectedBoardingPoint?.CityPointIndex === point.CityPointIndex && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{point.CityPointLocation}</h3>
                        <p className="text-sm text-gray-600 mb-1">{point.CityPointLandmark}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {point.CityPointAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          <i className="fas fa-phone mr-1"></i>
                          {point.CityPointContactNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropping Points Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <i className="fas fa-flag-checkered text-green-600"></i>
              Dropping Points
            </h2>

            {DropingPointsDetails.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No dropping points available.</p>
            ) : (
              <div className="space-y-3">
                {DropingPointsDetails.map((point) => (
                  <div
                    key={point.CityPointIndex}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedDroppingPoint?.CityPointIndex === point.CityPointIndex
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    onClick={() => setSelectedDroppingPoint(point)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 mt-1 ${selectedDroppingPoint?.CityPointIndex === point.CityPointIndex
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                        }`}>
                        {selectedDroppingPoint?.CityPointIndex === point.CityPointIndex && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{point.CityPointLocation}</h3>
                        <p className="text-sm text-gray-600 mb-1">{point.CityPointLandmark}</p>
                        <p className="text-xs text-gray-500 mb-1">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {point.CityPointAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          <i className="fas fa-phone mr-1"></i>
                          {point.CityPointContactNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Points Summary */}
        {(selectedBoardingPoint || selectedDroppingPoint) && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBoardingPoint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Boarding Point</h4>
                  <p className="text-sm text-blue-700">{selectedBoardingPoint.CityPointLocation}</p>
                  <p className="text-xs text-blue-600">{selectedBoardingPoint.CityPointLandmark}</p>
                </div>
              )}
              {selectedDroppingPoint && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Dropping Point</h4>
                  <p className="text-sm text-green-700">{selectedDroppingPoint.CityPointLocation}</p>
                  <p className="text-xs text-green-600">{selectedDroppingPoint.CityPointLandmark}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Seats
          </button>

          <button
            onClick={formdetails}
            disabled={!selectedBoardingPoint || !selectedDroppingPoint}
            className={`px-8 py-3 rounded-lg font-semibold transition ${selectedBoardingPoint && selectedDroppingPoint
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Continue to Passenger Details
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusBoardingPoint;