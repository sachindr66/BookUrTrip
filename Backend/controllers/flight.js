import axios from "axios";
import os from "os";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Helper function to get local IP safely (Vercel-safe)
function getLocalIp() {
    try {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name] || []) {
                if (iface && iface.family === "IPv4" && !iface.internal) {
                    return iface.address;
                }
            }
        }
    } catch (err) {
        console.warn("Unable to fetch local IP, using 127.0.0.1");
    }
    return "127.0.0.1";
}

// Helper for consistent error handling
const handleApiError = (error, res, endpointName) => {
    console.error(`${endpointName} error:`, error.response?.data || error.message);
    res.status(500).json({
        error: `${endpointName} failed`,
        details: error.response?.data || error.message,
    });
};

const baseUrl = "https://sandboxentityapi.trateq.com"; // Base URL for Snigdha Travel API

export const getFlightsAirports = async (req, res) => {
    try {
        const requestData = {
            Credential: {
                Type: "C",
                Module: "B",
                Domain: process.env.DOMAIN,
                LoginID: process.env.LOGIN_ID,
                Password: process.env.PASSWORD,
                LanguageLocale: "en",
                IpAddress: getLocalIp(),
            },
            AcType: "Airport",
            SearchText: "", // Optional — can be dynamic later
        };

        console.log("Requesting flight data with:", requestData);

        const response = await axios.post(
            `${baseUrl}/SIGNIX/B2B/StaticData/AC`,
            requestData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Origin": "https://sandboxentityapi.trateq.com",
                    "Referer": "https://sandboxentityapi.trateq.com/",
                },
                timeout: 20000, // 20 seconds timeout
            }
        );

        console.log("Flight data:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        // Log full error for debugging
        console.error("Full API error:", error.toJSON ? error.toJSON() : error);
        handleApiError(error, res, "getFlightsAirports");
    }
};
