import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';

// Flight search API
export const searchFlights = async (searchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/search`, {
      params: searchParams
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get flight details
export const getFlightDetails = async (flightId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/${flightId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get available seats for a flight
export const getFlightSeats = async (flightId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/flights/${flightId}/seats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Book a flight
export const bookFlight = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/flights/book`, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
