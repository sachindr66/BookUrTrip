// Empty file - rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import busesReducer from "../features/buses/busesSlice";
import transferReducer from "../features/transfer/transferSlice"
import flightsReducer from "../features/flights/flightsSlice";
import authReducer from "../features/auth/authSlice"
import insuranceReducer  from "../features/insurance/insuranceSlice";

const rootReducer = combineReducers({
  buses: busesReducer,
  insurance: insuranceReducer,
  transfer: transferReducer,
  flights: flightsReducer,
  auth:authReducer,
});

export default rootReducer;
