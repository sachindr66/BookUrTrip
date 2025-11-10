// import axios from "axios";
// import os from "os";
// import dotenv from "dotenv";

// dotenv.config(); // Load environment variables

// // Helper function to get local IP
// function getLocalIp() {
//     const interfaces = os.networkInterfaces();
//     for (const name of Object.keys(interfaces)) {
//         for (const iface of interfaces[name] || []) {
//             if (iface && iface.family === "IPv4" && !iface.internal) {
//                 return iface.address;
//             }
//         }
//     }
//     return "127.0.0.1";
// }

// // Helper function for consistent error handling
// const handleApiError = (error, res, endpointName) => {
//     console.error(`${endpointName} error:`, error.response?.data || error.message);
//     res.status(500).json({
//         error: `${endpointName} failed`,
//         details: error.response?.data || error.message
//     });
// };

// // Credentials for API request


// const baseUrl = "https://sandboxentityapi.trateq.com"; // Base URL for Snigdha Travel API


// export const getFlightsAirports = async (req, res) => {
//     try {

//         const requestData = {
//             Credential: {
//                 Type: "C",
//                 Module: "B",
//                 Domain: process.env.DOMAIN,
//                 LoginID: process.env.LOGIN_ID,
//                 Password: process.env.PASSWORD,
//                 LanguageLocale: "en",
//                 IpAddress: getLocalIp(),
//             },
//             AcType: "Airport",
//             // SearchText: "" // Optional; you can make this dynamic later
//         };


//         const response = await axios.post(`${baseUrl}/SIGNIX/B2B/StaticData/AC`, requestData, {
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         console.log("Flight data:", response.data);
//         res.status(200).json(response.data);

//     } catch (error) {
//         handleApiError(error, res, "Authenticateflight");
//     }
// };



import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getFlightsAirports = async (req, res) => {
    try {
        // console.log("🚀 Making Trateq API request from Vercel...", {
        //     domain: process.env.DOMAIN,
        //     loginId: process.env.LOGIN_ID,
        //     hasPassword: !!process.env.PASSWORD,
        //     environment: process.env.NODE_ENV,
        // });

        const requestBody = {
            Credential: {
                Type: "C",
                Module: "X",
                Domain: process.env.DOMAIN,
                LoginID: process.env.LOGIN_ID,
                Password: process.env.PASSWORD,
                LanguageLocale: process.env.LANGUAGE || "en",
                IpAddress: "8.8.8.8", // static IP to avoid network interface issues
            },
            AcType: "AIRPORT",
        };

        const response = await axios.post(
            "https://sandboxentityapi.trateq.com/SIGNIX/B2B/StaticData/AC",
            requestBody,
            {
                timeout: 10000,
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "BookUrTrip/1.0",
                    "Accept": "application/json, text/plain, */*",
                },
            }
        );

        console.log("✅ Trateq API Success - Status:", response.status);
        console.log("Response from flight airports API:", response.data);

        if (!response.data || Object.keys(response.data).length === 0) {
            return res.status(404).json({ error: "No airports found" });
        }

        res.status(200).json(response.data);
    } catch (error) {
        console.error("🔴 TRATEQ API FAILED - FULL ERROR DETAILS:");
        console.error("Error Message:", error.message);
        console.error("Error Code:", error.code);
        console.error("Stack:", error.stack);

        // if (error.response) {
        //     console.error("🔴 RESPONSE ERROR:");
        //     console.error("Status:", error.response.status);
        //     console.error("Data:", JSON.stringify(error.response.data, null, 2));

        //     return res.status(error.response.status).json({
        //         error: "Trateq API Error",
        //         status: error.response.status,
        //         data: error.response.data,
        //     });
        // }

        // if (error.request) {
        //     return res.status(503).json({
        //         error: "Trateq API Unavailable",
        //         details: "No response received from Trateq API",
        //     });
        // }

        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message,
        });
    }
};
