
import axios from "axios";
import os from "os";


function getLocalIp() {
    const interfaces = os.networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {

            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }

        }
    }

    return "127.0.0.1";
}

const endUserIp = getLocalIp();

// Helper function for consistent error handling

const handleApiError = (error, res, endpointName) => {

    console.error(`${endpointName} error:`, error.response?.data || error.message)
    res.status(500).json({
        error: `${endpointName}failed`,
        details: error.response?.data || error.message
    })

}

export const authenticateInsuranceAPI = async (req, res) => {

    try {
        const data = {
            "ClientId": process.env.BUS_API_CLIENTID,
            "UserName": process.env.BUS_API_USERNAME,
            "Password": process.env.BUS_API_PASSWORD,
            "EndUserIp": getLocalIp(),
        }

        const apiResponse = await axios.post(
            'http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate',
            data,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        console.log("Insurance authentication successful")
        res.json({
            TokenId: apiResponse.data.TokenId,
            EndUserIp: endUserIp,
            message: "Insurance authentication successful",
            data: apiResponse.data,
        })

    } catch (error) {
        handleApiError(error, res, "authenticateInsuranceAPI")

    }

}

export const insurancerSearchAPI = async (req, res) => {
    const {
        PlanCategory,
        PlanType,
        PlanCoverage,
        TravelStartDate,
        TravelEndDate,
        NoOfPax,
        PaxAge,
        TokenId
    } = req.body


    const data = {
        "TokenId": TokenId,
        "PlanCategory": PlanCategory || 1,
        "PlanType": PlanType || 1,
        "PlanCoverage": PlanCoverage || 4,
        "TravelStartDate": TravelStartDate,
        "TravelEndDate": TravelEndDate,
        "NoOfPax": NoOfPax,
        "PaxAge": PaxAge || 22,
        "EndUserIp": endUserIp
    }
    try {

        const apiResponse = await axios.post(
            "https://InsuranceBE.tektravels.com/InsuranceService.svc/rest/Search",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const apiError = apiResponse.data?.Response?.Error;

        // ❌ TekTravels error
        if (apiError?.ErrorCode && Number(apiError.ErrorCode) !== 0) {
            console.log("❌ TekTravels Error:", apiError.ErrorMessage);

            return res.status(400).json({
                success: false,
                errorCode: apiError.ErrorCode,
                message: apiError.ErrorMessage,
            });
        }

        // ✅ Success
        return res.status(200).json({
            success: true,
            message: "Insurance Search successful",
            data: apiResponse.data,
        });

    } catch (error) {
        handleApiError(error, res, "InsuranceSearchAPI")
    }
}