import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

// Example: Passenger management (local state only, no API)
const initialPassengers = [
  {
    Title: 'Mr',
    FirstName: '',
    LastName: '',
    Age: '',
    Gender: 'Male',
    Mobile: '',
    Email: '',
    Address: '',
    SeatId: '',
    SeatName: ''
  }
];

// 🔹 Authenticate API
export const authenticateBus = createAsyncThunk(
  "buses/authenticateBus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/authenticate`)
      // const response = await axios.post("http://localhost:5000/authenticate");
      return response.data.data; // backend sends { data: { TokenId, ... } }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Authentication failed");
    }
  }
);


// 🔹 Fetch Bus Cities API
export const fetchBusCityList = createAsyncThunk(
  "buses/fetchBusCityList",
  async (tokenId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/getBusCityList`,{
      // const response = await axios.post("http://localhost:5000/getBusCityList", {
        TokenId: tokenId,
      });
      
      return response.data.data; // backend sends { data: { CityList } }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Fetching cities failed");
    }
  }
);

export const fetchSearch = createAsyncThunk(
  "buses/fetchSearch",
  async({DateOfJourney,DestinationId,OriginId,TokenId},{rejectWithValue})=>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/busSearch`,{
      // const response =await axios.post("http://localhost:5000/busSearch"){
      DateOfJourney,
      DestinationId,
      OriginId,
      TokenId
      })

      return response.data.data
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Fetching Search failed");
    }
  }
)

export const busSeatLayout=createAsyncThunk(
  "buses/busSeatLayout",
  async({EndUserIp,ResultIndex,TraceId,TokenId},{rejectWithValue})=>{

    try {
      const response =await axios.post(`${import.meta.env.VITE_API_URL}/busSeatLayout`,{
        EndUserIp,
        ResultIndex,
        TraceId,
        TokenId,
      })
      console.log("Raw API SeatLayout response:", response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error ||  "Fetching SeatLayout Failed")
    }
  }
)

export const busBoardingPoint=createAsyncThunk(
  "buses/busBoardingPoint",

  async({EndUserIp,ResultIndex,TraceId,TokenId},{rejectWithValue})=>{

    try {
      const response= await axios.post(`${import.meta.env.VITE_API_URL}/busBoardingPoint`,{
        EndUserIp,
        ResultIndex,
        TraceId,
        TokenId,
    })
     console.log("Raw API BoardingPointsDetails response:", response.data);
     return response.data.BoardingPointsDetails || response.data
      
    } catch (error) {
      
      return rejectWithValue(error.response?.data?.error ||  "Fetching BoardingPointsDetails Failed")
      
    }

  }
)

export const busBlock=createAsyncThunk(
  "buses/busBlock",
  async({EndUserIp,ResultIndex,TraceId,TokenId,BoardingPointId,DroppingPointId,Passenger},{rejectWithValue})=>{
    try {
      const response=await axios.post(`${import.meta.env.VITE_API_URL}/busBlock`,{
        EndUserIp,ResultIndex,TraceId,TokenId,BoardingPointId,DroppingPointId,Passenger
      })
      console.log('Redux received bus block data',response.data.data)
      return response.data.data
    }
    catch (error) {
      return rejectWithValue(error.response?.data?.error || "Bus Block Failed")
    }
  }
)


export const fetchBusBook = createAsyncThunk(
  "buses/busBook",
  async({EndUserIp,ResultIndex,TraceId,TokenId,BoardingPointId,DroppingPointId,Passenger},{rejectWithValue})=>{

    try {
      const response=await axios.post(`${import.meta.env.VITE_API_URL}/getBusBook`,{
        EndUserIp,ResultIndex,TraceId,TokenId,BoardingPointId,DroppingPointId,Passenger
      })
      console.log("Redux received Bus Book Confirmation", response.data)
      return response.data
      
    } catch (error) {
      // CORRECTED: Changed 'err' to 'error'
      return rejectWithValue(error.response?.data?.error || "Bus Book Failed")
      
    }
  }
)


// Helper functions for localStorage with data expiration
const saveToLocalStorage = (key, data, expirationHours = 24) => {
  try {
    const item = {
      data: data,
      timestamp: Date.now(),
      expiration: expirationHours * 60 * 60 * 1000 // Convert hours to milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // If storage is full, try to clear old data
    if (error.name === 'QuotaExceededError') {
      clearExpiredData();
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (retryError) {
        console.error('Still unable to save after cleanup:', retryError);
      }
    }
  }
};

const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    const parsed = JSON.parse(item);
    
    // Check if data has expired
    if (parsed.timestamp && parsed.expiration) {
      const now = Date.now();
      if (now - parsed.timestamp > parsed.expiration) {
        localStorage.removeItem(key);
        return defaultValue;
      }
    }
    
    return parsed.data || defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

const clearExpiredData = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bus')) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && parsed.expiration) {
              const now = Date.now();
              if (now - parsed.timestamp > parsed.expiration) {
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            // If parsing fails, remove the corrupted item
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Error clearing expired data:', error);
  }
};



const busesSlice = createSlice({
  name: "buses",
  initialState: {
    tokenId: loadFromLocalStorage('busTokenId'),
    cities: loadFromLocalStorage('busCities', []),
    searchResults: loadFromLocalStorage('busSearchResults', []),
    traceId: null,
    SeatLayoutResults: [],
    BoardingPointsDetails: [],
    DropingPointsDetails: [],
    // busBlockData: loadFromLocalStorage('busBlockData', null),
    busBlockData: [],
    passengers: loadFromLocalStorage('passengers', initialPassengers),
    busBookData:[],
    status: "idle",
    error: null,
  },
  reducers: {
    // Passengers
    addPassenger: (state) => {
      state.passengers.push({
        Title: 'Mr',
        FirstName: '',
        LastName: '',
        Age: '',
        Gender: 'Male',
        Mobile: '',
        Email: '',
        Address: '',
        SeatId: '',
        SeatName: ''
      });
      saveToLocalStorage('passengers', state.passengers);
    },
    removePassenger: (state, action) => {
      state.passengers.splice(action.payload, 1);
      saveToLocalStorage('passengers', state.passengers);
    },
    updatePassenger: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.passengers[index]) {
        state.passengers[index][field] = value;
        saveToLocalStorage('passengers', state.passengers);
      }
    },

    // Clear functions
    clearSearchResults: (state) => {
      state.searchResults = [];
      localStorage.removeItem('busSearchResults');
    },
    clearAllData: (state) => {
      state.tokenId = null;
      state.cities = [];
      state.searchResults = [];
      state.traceId = null;
      state.SeatLayoutResults = [];
      state.BoardingPointsDetails = [];
      state.DropingPointsDetails = [];
      state.busBlockData = null;
      state.passengers = [...initialPassengers];
      state.status = "idle";
      state.error = null;
      localStorage.removeItem('busTokenId');
      localStorage.removeItem('busCities');
      localStorage.removeItem('busSearchResults');
      localStorage.removeItem('busBlockData');
      localStorage.removeItem('passengers');
    },
    clearBusBlockData: (state) => {
      state.busBlockData = null;
      localStorage.removeItem('busBlockData');
    }
  },

  extraReducers: (builder) => {
    builder
      // Authenticate
      .addCase(authenticateBus.pending, (state) => {
        state.status = "authloading";
        state.error = null;
      })
      .addCase(authenticateBus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tokenId = action.payload.TokenId;
        saveToLocalStorage('busTokenId', action.payload.TokenId, 2); // Token expires in 2 hours
      })
      .addCase(authenticateBus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch Cities
      .addCase(fetchBusCityList.pending, (state) => {
        state.status = "citiesloading";
      })
      .addCase(fetchBusCityList.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Extract cities from the actual API response structure
        // API returns: { BusCities: [...], Error: null, Status: 1, TokenId: "..." }
        const cityList = action.payload?.BusCities || action.payload || [];
        state.cities = Array.isArray(cityList) ? cityList : [];
        saveToLocalStorage('busCities', state.cities, 24); // Cities expire in 24 hours
      })
      .addCase(fetchBusCityList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //Search Bus
      .addCase(fetchSearch.pending, (state)=>{
        state.status="searchloading"
      })
      .addCase(fetchSearch.fulfilled, (state, action)=>{
        state.status = "succeeded"
        // Handle the API response structure - it might be directly an array or nested
        const busResults = action.payload?.BusSearchResult?.BusResults || action.payload || [];
        const traceId=action.payload?.BusSearchResult?.TraceId
        state.searchResults = Array.isArray(busResults) ? busResults : [];
        state.traceId=traceId
        saveToLocalStorage('busSearchResults', state.searchResults, 1); // Search results expire in 1 hour
      })
      .addCase(fetchSearch.rejected,(state,action)=>{
        state.status="failed"
        state.error=action.payload
      })

      //Bus SeatLayout

     .addCase(busSeatLayout.pending, (state, action)=>{
      state.status= "seatloading"
      state.error = null;
     })

      .addCase(busSeatLayout.fulfilled,(state,action)=>{
        state.status="succeeded"
        // The correct API response structure is: action.payload.GetBusSeatLayOutResult.SeatLayoutDetails
        const busSeatLayout = action.payload?.GetBusSeatLayOutResult?.SeatLayoutDetails || {};
        console.log(" From Redux stored SeatLayout:", busSeatLayout)
        state.SeatLayoutResults = busSeatLayout
      })  

      .addCase(busSeatLayout.rejected,(state, action)=>{
        state.status="failed",
        state.error=action.payload
      })

      //Bus BoardingPointsDetails

      .addCase(busBoardingPoint.pending,(state)=>{
        state.status="boardingloading"
        state.error = null;
      })
      .addCase(busBoardingPoint.fulfilled,(state,action)=>{
        state.status="succeeded"
        const busBoardingPoint=action.payload?.data?.BoardingPointsDetails || []
        const busDropingPoint=action.payload?.data?.DroppingPointsDetails || []
        state.BoardingPointsDetails=busBoardingPoint
        state.DropingPointsDetails=busDropingPoint
        console.log("redux debubug", busDropingPoint)
      })
      .addCase(busBoardingPoint.rejected,(state,action)=>{
        state.status="failed"
        state.error=action.payload
      })

      //Bus Block

      .addCase(busBlock.pending,(state)=>{
        state.status="blockloading"
        state.error=null
      })
      .addCase(busBlock.fulfilled,(state,action)=>{
        state.status="succeeded"
        state.busBlockData = action.payload
        saveToLocalStorage('busBlockData', action.payload, 0.5); // Block data expires in 30 minutes
        console.log('Redux received bus block payload data',action.payload)
      })
      .addCase(busBlock.rejected,(state,action)=>{
        state.status="failed"
        state.error=action.payload
      })


      //Bus Book

      .addCase(fetchBusBook.pending,(state)=>{
        state.status="bookloading"
        state.error=null
      })

      .addCase(fetchBusBook.fulfilled,(state,action)=>{
        state.status="succeeded"
        state.busBookData=action.payload
        console.log("Redux received bus Book payload Data", action.payload)
      })

      .addCase(fetchBusBook.rejected,(state,action)=>{
        state.status= "failed"
        state.error= action.payload
      })
  },
});

export const {
  addPassenger,
  removePassenger,
  updatePassenger,
  clearSearchResults,
  clearAllData,
  clearBusBlockData
} = busesSlice.actions;
export default busesSlice.reducer;
