import axios from "axios";

const API_BASE = process.env.VITE_API_URL 

// Authenticate API
export const authenticate = async () => {
  const res = await axios.post(`${API_BASE}/authenticate`);
  return res.data.data;
};

// Get City List API
export const getCityList = async (tokenId) => {
  const res = await axios.post(`${API_BASE}/getBusCityList`, { TokenId: tokenId });
  return res.data.data;
};
