import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// -------------------- AUTHENTICATE TRANSFER --------------------
export const authenticateTransfer = createAsyncThunk(
  "transfer/authenticateTransfer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transfer/authenticate`
      );
      console.log("Transfer authenticate successful", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Authenticate Transfer failed"
      );
    }
  }
);

// -------------------- COUNTRY LIST --------------------
export const countryList = createAsyncThunk(
  "transfer/countryList",
  async (TokenId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/transfer/countrylist`,
        { TokenId }
      );

      console.log("Transfer raw Country List successful", response.data);

      // Extract XML string from API
      const xmlString = response.data?.data?.CountryList;
      if (!xmlString) return [];

      // ✅ Parse XML using built-in DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      // Convert XML to array of countries
      const countries = Array.from(xmlDoc.getElementsByTagName("Country")).map(
        (node) => ({
          Code: node.getElementsByTagName("Code")[0]?.textContent || "",
          Name: node.getElementsByTagName("Name")[0]?.textContent || "",
        })
      );

      return countries;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Fetching country list failed"
      );
    }
  }
);

// -------------------- SLICE --------------------
const transfersSlice = createSlice({
  name: "transfer",
  initialState: {
    tokenId: [],
    status: "idle",
    error: null,
    countrylist: [],
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Authenticate Transfer
      .addCase(authenticateTransfer.pending, (state) => {
        state.status = "authLoading";
        state.error = null;
      })
      .addCase(authenticateTransfer.fulfilled, (state, action) => {
        state.status = "authSucceeded";
        state.tokenId = action.payload?.data?.TokenId || [];
      })
      .addCase(authenticateTransfer.rejected, (state, action) => {
        state.status = "authFailed";
        state.error = action.payload;
      })

      // Country List
      .addCase(countryList.pending, (state) => {
        state.status = "countryLoading";
        state.error = null;
      })
      .addCase(countryList.fulfilled, (state, action) => {
        state.status = "countrySucceeded";
        state.countrylist = action.payload || [];
      })
      .addCase(countryList.rejected, (state, action) => {
        state.status = "countryFailed";
        state.error = action.payload;
      });
  },
});

export default transfersSlice.reducer;
