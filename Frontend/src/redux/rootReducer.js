// Empty file - rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import busesReducer from "../features/buses/busesSlice";
import transferReducer from "../features/transfer/transferSlice"

const rootReducer = combineReducers({
  buses: busesReducer,
  transfer: transferReducer,
});

export default rootReducer;
