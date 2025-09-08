import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchFlights, getFlightDetails, getFlightSeats } from '../../api/flightApi';

// Async thunks
export const fetchFlights = createAsyncThunk(
  'flights/fetchFlights',
  async (searchParams) => {
    const response = await searchFlights(searchParams);
    return response;
  }
);

export const fetchFlightDetails = createAsyncThunk(
  'flights/fetchFlightDetails',
  async (flightId) => {
    const response = await getFlightDetails(flightId);
    return response;
  }
);

export const fetchFlightSeats = createAsyncThunk(
  'flights/fetchFlightSeats',
  async (flightId) => {
    const response = await getFlightSeats(flightId);
    return response;
  }
);

const initialState = {
  flights: [],
  selectedFlight: null,
  flightSeats: [],
  loading: false,
  error: null,
  searchParams: null
};

const flightsSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.selectedFlight = null;
      state.flightSeats = [];
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    selectFlight: (state, action) => {
      state.selectedFlight = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFlightDetails.fulfilled, (state, action) => {
        state.selectedFlight = action.payload;
      })
      .addCase(fetchFlightSeats.fulfilled, (state, action) => {
        state.flightSeats = action.payload;
      });
  }
});

export const { clearFlights, setSearchParams, selectFlight } = flightsSlice.actions;
export default flightsSlice.reducer;
