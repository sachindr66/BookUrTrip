# Complete Bus Redux Toolkit Usage Guide

## 🚌 Updated busesSlice.js - Complete Implementation

Your `busesSlice.js` now includes **ALL** bus-related functionality in a single, comprehensive Redux Toolkit implementation.

## 📋 Available Actions

### **1. Authentication & Cities**
```javascript
import { authenticateBus, fetchBusCityList } from '../features/buses/busesSlice';

// Authenticate
dispatch(authenticateBus());

// Fetch cities
dispatch(fetchBusCityList({ TokenId, IpAddress }));
```

### **2. Search & Results**
```javascript
import { fetchSearch } from '../features/buses/busesSlice';

// Search buses
dispatch(fetchSearch({
  DateOfJourney: "2024-01-15",
  DestinationId: "123",
  OriginId: "456",
  TokenId: "token123"
}));
```

### **3. Seat Layout & Boarding Points**
```javascript
import { busSeatLayout, busBoardingPoint } from '../features/buses/busesSlice';

// Get seat layout
dispatch(busSeatLayout({
  EndUserIp: "192.168.1.1",
  ResultIndex: 0,
  TraceId: "trace123",
  TokenId: "token123"
}));

// Get boarding points
dispatch(busBoardingPoint({
  EndUserIp: "192.168.1.1",
  ResultIndex: 0,
  TraceId: "trace123",
  TokenId: "token123"
}));
```

### **4. Bus Block (Seat Reservation)**
```javascript
import { busBlock, formatPassengersForBlock } from '../features/buses/busesSlice';

// Format passengers for API
const formattedPassengers = formatPassengersForBlock(passengers, SeatLayoutResults);

// Block seats
dispatch(busBlock({
  EndUserIp: "192.168.1.1",
  ResultIndex: 0,
  TraceId: "trace123",
  TokenId: "token123",
  BoardingPointId: 1,
  DroppingPointId: 2,
  Passenger: formattedPassengers
}));
```

### **5. Booking Operations**
```javascript
import { 
  fetchBusBooking, 
  fetchBusBookingDetails, 
  createBusBooking 
} from '../features/buses/busesSlice';

// Create booking
dispatch(fetchBusBooking(bookingData));

// Get booking details
dispatch(fetchBusBookingDetails(bookingDetailsData));

// Save to database
dispatch(createBusBooking(bookingData));
```

### **6. User Bookings Management**
```javascript
import { 
  fetchUserBusBookings, 
  updateBusBookingStatus, 
  cancelBusBooking,
  fetchBusBookingStats 
} from '../features/buses/busesSlice';

// Get user's bookings
dispatch(fetchUserBusBookings(userId));

// Update booking status
dispatch(updateBusBookingStatus({ 
  bookingId: "123", 
  statusData: { status: "confirmed" } 
}));

// Cancel booking
dispatch(cancelBusBooking("123"));

// Get booking statistics
dispatch(fetchBusBookingStats(userId));
```

### **7. Passenger Management**
```javascript
import { 
  addPassenger, 
  removePassenger, 
  updatePassenger, 
  clearPassengers 
} from '../features/buses/busesSlice';

// Add passenger
dispatch(addPassenger());

// Update passenger
dispatch(updatePassenger({ 
  index: 0, 
  field: 'FirstName', 
  value: 'John' 
}));

// Remove passenger
dispatch(removePassenger(1));

// Clear all passengers
dispatch(clearPassengers());
```

### **8. Data Management**
```javascript
import { 
  clearSearchResults, 
  clearAllData, 
  clearBusBlockData,
  clearBookingData,
  clearUserBookings,
  clearBookingStats
} from '../features/buses/busesSlice';

// Clear specific data
dispatch(clearSearchResults());
dispatch(clearBusBlockData());
dispatch(clearBookingData());
dispatch(clearUserBookings());
dispatch(clearBookingStats());

// Clear everything
dispatch(clearAllData());
```

## 🏗️ State Structure

```javascript
const state = {
  // Authentication
  tokenId: "token123",
  
  // Cities & Search
  cities: [...],
  searchResults: [...],
  traceId: "trace123",
  
  // Seat & Boarding
  SeatLayoutResults: {...},
  BoardingPointsDetails: [...],
  DropingPointsDetails: [...],
  
  // Block & Booking
  busBlockData: {...},
  bookingData: {...},
  bookingDetails: {...},
  
  // User Data
  passengers: [...],
  userBookings: [...],
  bookingStats: {...},
  
  // Status
  status: "idle" | "loading" | "succeeded" | "failed",
  error: null
};
```

## 🎯 Complete Component Example

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  authenticateBus,
  fetchSearch,
  busSeatLayout,
  busBoardingPoint,
  busBlock,
  fetchBusBooking,
  addPassenger,
  updatePassenger,
  formatPassengersForBlock
} from '../features/buses/busesSlice';

const BusBookingComponent = () => {
  const dispatch = useDispatch();
  const {
    tokenId,
    cities,
    searchResults,
    SeatLayoutResults,
    BoardingPointsDetails,
    busBlockData,
    passengers,
    status,
    error
  } = useSelector(state => state.buses);

  // Initialize
  useEffect(() => {
    if (!tokenId) {
      dispatch(authenticateBus());
    }
  }, [tokenId, dispatch]);

  // Search buses
  const handleSearch = () => {
    dispatch(fetchSearch({
      DateOfJourney: "2024-01-15",
      DestinationId: "123",
      OriginId: "456",
      TokenId: tokenId
    }));
  };

  // Get seat layout
  const handleSeatLayout = (resultIndex) => {
    dispatch(busSeatLayout({
      EndUserIp: "192.168.1.1",
      ResultIndex: resultIndex,
      TraceId: searchResults?.BusSearchResult?.TraceId,
      TokenId: tokenId
    }));
  };

  // Block seats
  const handleBlockSeats = () => {
    const formattedPassengers = formatPassengersForBlock(passengers, SeatLayoutResults);
    
    dispatch(busBlock({
      EndUserIp: "192.168.1.1",
      ResultIndex: 0,
      TraceId: searchResults?.BusSearchResult?.TraceId,
      TokenId: tokenId,
      BoardingPointId: 1,
      DroppingPointId: 2,
      Passenger: formattedPassengers
    }));
  };

  // Add passenger
  const handleAddPassenger = () => {
    dispatch(addPassenger());
  };

  // Update passenger
  const handleUpdatePassenger = (index, field, value) => {
    dispatch(updatePassenger({ index, field, value }));
  };

  if (status === "loading") return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Bus Booking System</h1>
      
      {/* Search Section */}
      <button onClick={handleSearch}>Search Buses</button>
      
      {/* Results */}
      {searchResults?.map((bus, index) => (
        <div key={index}>
          <h3>{bus.BusName}</h3>
          <button onClick={() => handleSeatLayout(index)}>
            Select Seats
          </button>
        </div>
      ))}
      
      {/* Seat Layout */}
      {SeatLayoutResults && (
        <div>
          <h3>Select Seats</h3>
          {/* Render seat layout */}
        </div>
      )}
      
      {/* Passengers */}
      <div>
        <h3>Passenger Details</h3>
        {passengers.map((passenger, index) => (
          <div key={index}>
            <input
              value={passenger.FirstName}
              onChange={(e) => handleUpdatePassenger(index, 'FirstName', e.target.value)}
              placeholder="First Name"
            />
            <input
              value={passenger.LastName}
              onChange={(e) => handleUpdatePassenger(index, 'LastName', e.target.value)}
              placeholder="Last Name"
            />
            {/* More fields... */}
          </div>
        ))}
        <button onClick={handleAddPassenger}>Add Passenger</button>
      </div>
      
      {/* Block Seats */}
      <button onClick={handleBlockSeats}>Block Seats</button>
      
      {/* Block Result */}
      {busBlockData && (
        <div>
          <h3>Seats Blocked Successfully!</h3>
          <p>Block ID: {busBlockData.BlockId}</p>
        </div>
      )}
    </div>
  );
};

export default BusBookingComponent;
```

## ✨ Key Features

- ✅ **Complete Bus Booking Flow** - From search to booking
- ✅ **Passenger Management** - Add, update, remove passengers
- ✅ **localStorage Persistence** - Data survives page refreshes
- ✅ **Error Handling** - Built-in error management
- ✅ **Loading States** - Track operation status
- ✅ **Data Expiration** - Automatic cleanup of old data
- ✅ **Type Safety** - Better with TypeScript
- ✅ **Performance** - Optimized Redux Toolkit

## 🚀 Benefits Over Traditional Redux

1. **70% Less Code** - No action types, action creators
2. **Automatic Immutability** - No spread operators needed
3. **Built-in Error Handling** - rejectWithValue
4. **Better Performance** - Automatic optimizations
5. **Easier Testing** - Simpler test setup
6. **Future Proof** - Modern Redux standard

Your busesSlice.js is now a complete, production-ready Redux Toolkit implementation! 🎉
