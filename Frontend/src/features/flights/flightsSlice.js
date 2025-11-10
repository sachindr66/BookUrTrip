import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const featchAirports = createAsyncThunk(
  'flights/featchAirports',
  async (_, { rejectWithValue }) => {
    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/getFlightsAirports`);
      console.log("row redux flightAirport data", response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "fetchAirports failed");
    }
  }
)



const flightsSlice = createSlice({
  name: 'flights',
  initialState: {
    airports: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(featchAirports.pending, (state) => {
        state.status = "fetching Airports";
        state.error = null;
      })
      .addCase(featchAirports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.airports = action.payload;
      })
      .addCase(featchAirports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default flightsSlice.reducer;

