import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';

// Hotel search API
export const searchHotels = async (searchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels/search`, {
      params: searchParams
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel details
export const getHotelDetails = async (hotelId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels/${hotelId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get hotel rooms
export const getHotelRooms = async (hotelId, checkIn, checkOut) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/hotels/${hotelId}/rooms`, {
      params: { checkIn, checkOut }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Book a hotel
export const bookHotel = async (bookingData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hotels/book`, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
