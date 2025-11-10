import express from 'express';
import { getFlightsAirports } from '../controllers/flight.js';


const router = express.Router();

// Define your flight-related routes here

router.post(`/getFlightsAirports`, getFlightsAirports);

export default router