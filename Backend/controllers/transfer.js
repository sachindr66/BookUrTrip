import axios from "axios";
import os from "os"
import dotenv from "dotenv";
import { application } from "express";
dotenv.config();

const getLocalIp = () => {
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


// Helper function for consistent error handling
const handleApiError = (error, res, endpointName) => {
  console.error(`${endpointName} error:`, error.response?.data || error.message);
  res.status(500).json({
    error: `${endpointName} failed`,
    details: error.response?.data || error.message
  });
};


export const authenticataTransferAPI = async (req, res) => {

  const Data = {
    "ClientId": process.env.transfer_API_CLIENTID,
    "UserName": process.env.transfer_API_USERNAME,
    "Password": process.env.transfer_API_PASSWORD,
    "EndUserIp": getLocalIp(),
  }

  try {
    const response = await axios.post("http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate",
      Data, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    console.log("transefer api successfully done", response.data)
    res.json({
      message: "Transfer authentication successful",
      data: response.data
    })

  } catch (error) {
    console.log("error", error)
    handleApiError(error, res, authenticataTransferAPI)
  }
}

export const countryList = async (req, res) => {

  const { TokenId, } = req.body

  if (!TokenId) {
    return res.status(400).json({ error: "TokenId is required" });
  }


  const Data = {
    TokenId,
    EndUserIp: getLocalIp(),
    ClientId: process.env.transfer_API_CLIENTID,
  }
  try {
    const response = await axios.post("http://Sharedapi.tektravels.com/SharedData.svc/rest/CountryList",
      Data, {
      headers: {
        "Content-Type": "application/json"
      }
    }
    )
    console.log("Country list response:", response.data);
    res.json({
      message: "Transfer CountryList successful",
      data:response.data
    })

  } catch (error) {
    handleApiError(error, res, countryList)
  }

}

export const getDestinationSearchStaticData=async(req, res)=>{

  const {TokenId,CountryCode}=req.body

  const Data={
    TokenId,
    CountryCode,
    EndUserIp: getLocalIp(),
    SearchType  :"1"
  }
  console.log("Token id destintion",TokenId)
  console.log("countryCide" ,CountryCode)

  try {
    const response = await axios.post("http://sharedapi.tektravels.com/staticdata.svc/rest/GetDestinationSearchStaticData",
      Data,
      {
        headers:{ "Content-Type":"application/json"
      }
    }
    )
    console.log("GetDestinationSearchStaticData", response.data)
    res.json({
      message:"Transfer GetDestinationSearchStaticData successful",
      data:response.data
    })
  } catch (error) {
    handleApiError(error, res, getDestinationSearchStaticData)
    
  }

}






