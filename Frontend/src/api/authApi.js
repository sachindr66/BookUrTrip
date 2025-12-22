import axios from "axios";

export const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include HTTP-only cookie
});
