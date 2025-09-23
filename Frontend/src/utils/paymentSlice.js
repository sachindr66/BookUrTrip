// paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createRazorpayOrder = createAsyncThunk(
  'payment/createRazorpayOrder',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-razorpay-order`, {
        amount: amount * 100, // Convert to paise
        currency: "INR"
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment order creation failed");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/verify-payment`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Payment verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    orderId: null,
    paymentStatus: "idle",
    error: null,
    verificationStatus: "idle"
  },
  reducers: {
    clearPaymentState: (state) => {
      state.orderId = null;
      state.paymentStatus = "idle";
      state.error = null;
      state.verificationStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.paymentStatus = "loading";
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.paymentStatus = "succeeded";
        state.orderId = action.payload.orderId;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.error = action.payload;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.verificationStatus = "succeeded";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.verificationStatus = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;