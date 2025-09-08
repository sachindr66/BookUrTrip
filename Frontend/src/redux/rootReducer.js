// Empty file - rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import busesReducer from "../features/buses/busesSlice";

const rootReducer = combineReducers({
  buses: busesReducer,
});

export default rootReducer;
