import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaStar, 
  FaChevronDown, 
  FaChevronUp, 
  FaCamera, 
  FaWifi, 
  FaMapPin, 
  FaComment, 
  FaFileContract 
} from "react-icons/fa";
import { clearSearchResults } from "../busesSlice";

// Memoized BusCard component to prevent unnecessary re-renders
const BusCard = memo(({ 
  bus, 
  index, 
  expandedCards, 
  toggleExpanded, 
  formatTime, 
  calculateDuration, 
  getPrice, 
  formatDate, 
  getRandomRating, 
  selectSeats, 
}) => {
  const rating = getRandomRating(bus);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {/* Left Side - Bus Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {bus.TravelName || bus.ServiceName || 'Bus Operator'}
              </h3>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                {bus.BusType || 'Standard'}
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                <FaStar className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-700">{rating.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({rating.reviews} Reviews)</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                On Time
              </span>
            </div>

            {/* Timing Section */}
            <div className="flex items-center space-x-8 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatTime(bus.DepartureTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(bus.DepartureTime)}
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <div className="text-sm text-gray-500 mb-1">Duration</div>
                <div className="text-lg font-semibold text-gray-700">
                  {calculateDuration(bus.DepartureTime, bus.ArrivalTime)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {formatTime(bus.ArrivalTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(bus.ArrivalTime)} +1 day
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Price and Availability */}
          <div className="text-right ml-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ₹{getPrice(bus)}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {bus.AvailableSeats} Seats Left
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {Math.floor(bus.AvailableSeats / 3)} Single Seats
            </div>
            
            <button
              onClick={() => selectSeats(bus)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              SELECT SEATS
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="border-t border-gray-200">
        <div className="flex">
          {[
            { key: 'photos', label: 'Photos', icon: FaCamera },
            { key: 'amenities', label: 'Amenities', icon: FaWifi },
            { key: 'pickup', label: 'Pickup & Drop Points', icon: FaMapPin },
            { key: 'reviews', label: 'Ratings & Reviews', icon: FaComment },
            { key: 'policies', label: 'Policies', icon: FaFileContract }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => toggleExpanded(index, key)}
              className="flex-1 flex items-center justify-center space-x-2 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors border-r border-gray-200 last:border-r-0"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {expandedCards[`${index}-${key}`] ? (
                <FaChevronUp className="h-3 w-3" />
              ) : (
                <FaChevronDown className="h-3 w-3" />
              )}
            </button>
          ))}
        </div>

        {/* Expanded Content - Amenities */}
        {expandedCards[`${index}-amenities`] && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                <div className="space-y-1">
                  {bus.MTicketEnabled && <div className="text-sm text-gray-600">• M-Ticket</div>}
                  {bus.LiveTrackingAvailable && <div className="text-sm text-gray-600">• Live Tracking</div>}
                  <div className="text-sm text-gray-600">• A/C</div>
                  <div className="text-sm text-gray-600">• Charging Point</div>
                  <div className="text-sm text-gray-600">• Blanket</div>
                  <div className="text-sm text-gray-600">• Water Bottle</div>
                  <div className="text-sm text-gray-600">• Reading Light</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Additional Features</h4>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">• Emergency Exit</div>
                  <div className="text-sm text-gray-600">• First Aid Kit</div>
                  <div className="text-sm text-gray-600">• Fire Extinguisher</div>
                  <div className="text-sm text-gray-600">• GPS Tracking</div>
                  <div className="text-sm text-gray-600">• CCTV Surveillance</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content - Pickup & Drop Points */}
        {expandedCards[`${index}-pickup`] && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Boarding Points</h4>
                <div className="space-y-3">
                  {bus.BoardingPointsDetails && bus.BoardingPointsDetails.length > 0 ? (
                    bus.BoardingPointsDetails.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium text-gray-900">{point.CityPointName}</div>
                          <div className="text-sm text-gray-500">{point.CityPointLocation}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {formatTime(point.CityPointTime)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No boarding points available</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Dropping Points</h4>
                <div className="space-y-3">
                  {bus.DroppingPointsDetails && bus.DroppingPointsDetails.length > 0 ? (
                    bus.DroppingPointsDetails.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium text-gray-900">{point.CityPointName}</div>
                          <div className="text-sm text-gray-500">{point.CityPointLocation}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {formatTime(point.CityPointTime)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No dropping points available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content - Photos */}
        {expandedCards[`${index}-photos`] && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Bus Photos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
              <div className="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
                <FaCamera className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Photos will be available soon</p>
          </div>
        )}

        {/* Expanded Content - Reviews */}
        {expandedCards[`${index}-reviews`] && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Ratings & Reviews</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{rating.rating}</div>
                  <div className="flex items-center space-x-1">
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <FaStar className="h-4 w-4 text-yellow-400" />
                    <FaStar className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="text-sm text-gray-500">{rating.reviews} reviews</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    "Great service and comfortable journey. Driver was professional and on time."
                  </div>
                  <div className="text-xs text-gray-500 mt-1">- Verified Passenger</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded Content - Policies */}
        {expandedCards[`${index}-policies`] && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Policies</h4>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Cancellation Policy</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  {bus.CancellationPolicies && bus.CancellationPolicies.map((policy, policyIndex) => (
                    <div key={policyIndex}>
                      • {policy.PolicyText || `Cancel ${policy.HoursBeforeDeparture} hours before departure for ${policy.RefundPercentage}% refund`}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-1">ID Requirements</h5>
                <div className="text-sm text-gray-600">
                  {bus.IdProofRequired ? "Valid ID proof required for boarding" : "No ID proof required"}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Partial Cancellation</h5>
                <div className="text-sm text-gray-600">
                  {bus.PartialCancellationAllowed ? "Partial cancellation allowed" : "Partial cancellation not allowed"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

const BusResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults = [], busSeatLayout=[], status, error ,traceId} = useSelector((state) => state.buses);
  console.log(busSeatLayout)
  const [expandedCards, setExpandedCards] = useState({});

  // Memoized utility functions to prevent recreation on every render
  const formatTime = useCallback((dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }, []);

  const calculateDuration = useCallback((departureTime, arrivalTime) => {
    if (!departureTime || !arrivalTime) return 'N/A';
    const dep = new Date(departureTime);
    const arr = new Date(arrivalTime);
    const diffMs = arr - dep;
    
    if (diffMs < 0) return 'N/A'; // Handle overnight journeys
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, []);

  const getPrice = useCallback((bus) => {
    if (bus.BusPrice) {
      // Use offered price if available and positive, otherwise use published price
      const offeredPrice = bus.BusPrice.OfferedPriceRoundedOff;
      const publishedPrice = bus.BusPrice.PublishedPriceRoundedOff;
      
      if (offeredPrice && offeredPrice > 0) {
        return offeredPrice;
      } else if (publishedPrice && publishedPrice > 0) {
        return publishedPrice;
      }
    }
    return 'N/A';
  }, []);

  const formatDate = useCallback((dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  }, []);

  const getRandomRating = useCallback((bus) => {
    // Generate consistent rating based on bus ID
    const seed = bus.RouteId ? bus.RouteId.toString().slice(-2) : '0';
    const rating = (parseInt(seed) % 30 + 20) / 10; // Rating between 2.0 and 5.0
    const reviews = Math.floor(Math.random() * 500) + 100; // Reviews between 100-600
    return { rating: rating.toFixed(1), reviews };
  }, []);

  // Memoized toggle function
  const toggleExpanded = useCallback((cardIndex, section) => {
    setExpandedCards(prev => {
      const currentKey = `${cardIndex}-${section}`;
      const isCurrentlyOpen = prev[currentKey];
      
      // If clicking the same section, close it
      if (isCurrentlyOpen) {
        return {
          ...prev,
          [currentKey]: false
        };
      }
      
      // If clicking a different section, close all others for this card and open the clicked one
      const newState = { ...prev };
      
      // Close all sections for this card
      Object.keys(newState).forEach(key => {
        if (key.startsWith(`${cardIndex}-`)) {
          newState[key] = false;
        }
      });
      
      // Open the clicked section
      newState[currentKey] = true;
      
      return newState;
    });
  }, []);

  // Handle page load with existing data from localStorage
  useEffect(() => {
    // If we have search results from localStorage, set status to succeeded
    if (searchResults.length > 0 && status === "idle") {
      // Data is already loaded from localStorage, no need to redirect
      return;
    }
    
    // If no search results and not loading, redirect back to search page
    if (status === "idle" && searchResults.length === 0) {
      navigate("/buses");
    }
  }, [searchResults, status, navigate]);

  const selectSeats = useCallback((bus) => {
    // Navigate to seat selection page
      navigate("/busSeatLayoutPage", { 
        state: { 
          selectedBus: bus,
          traceId: traceId
        } 
      });
    }, [navigate, traceId]);

  const handleBackToSearch = useCallback(() => {
    // Clear search results when going back to search
    dispatch(clearSearchResults());
    navigate("/buses");
  }, [dispatch, navigate]);

  if (status === "loading" && searchResults.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Searching for buses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">🚌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Buses Found</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find any buses for your selected route and date.
          </p>
          <button
            onClick={handleBackToSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSearch}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
              <FaArrowLeft className="h-4 w-4" />
                <span>Back to Search</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-800">
                Bus Search Results ({searchResults.length})
              </h1>
              {status === "idle" && searchResults.length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (Loaded from previous search)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom px-4 py-8">
        <div className="space-y-4">
          {searchResults.map((bus, index) => (
            <BusCard
              key={`${bus.RouteId}-${index}`}
              bus={bus}
              index={index}
              expandedCards={expandedCards}
              toggleExpanded={toggleExpanded}
              formatTime={formatTime}
              calculateDuration={calculateDuration}
              getPrice={getPrice}
              formatDate={formatDate}
              getRandomRating={getRandomRating}
              selectSeats={selectSeats}
            />
          ))}
        </div>

        {/* Load More Button (if needed) */}
        {searchResults.length >= 10 && (
          <div className="text-center mt-8">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Load More Buses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusResultsPage;
