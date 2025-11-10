import axios from "axios";
import os from "os";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Helper function to get local IP
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface && iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "127.0.0.1";
}

// Helper function for consistent error handling
const handleApiError = (error, res, endpointName) => {
    console.error(`${endpointName} error:`, error.response?.data || error.message);
    res.status(500).json({
        error: `${endpointName} failed`,
        details: error.response?.data || error.message
    });
};

// Credentials for API request


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
            SearchText: "" // Optional; you can make this dynamic later
        };


        const response = await axios.post(`${baseUrl}/SIGNIX/B2B/StaticData/AC`, requestData, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("Flight data:", response.data);
        res.status(200).json(response.data);

    } catch (error) {
        handleApiError(error, res, "Authenticateflight");
    }
};
