import axios from "axios";
import { error } from "console";
import os from "os";
import { json } from "stream/consumers";

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

export const authenticateBusAPI= async(req, res)=>{

    const data={
        "ClientId":process.env.BUS_API_CLIENTID,
        "UserName":process.env.BUS_API_USERNAME,
        "Password":process.env.BUS_API_PASSWORD,
        "EndUserIp":getLocalIp(),
    }

    try{
        const apiResponse= await axios.post(
            'http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate',
            data,
            {
                headers:{
                    "Content-Type": "application/json",
                },
            }
        )
           res.json({
      message: "API response is working",
      data: apiResponse.data,
    });
        // res.json("Api response is working",apiResponse.data)
    }catch(error){
        console.log(error.response?.data || error.message);
        res.status(500).json({error: "Authentication failed"})
    }
}

export const getBusCityList =async(req,res)=>{

    const {TokenId}=req.body;
   const data = {
    TokenId,
    IpAddress: getLocalIp(), // Changed from EndUserIp to IpAddress
  };

  console.log("getBusCityList called with TokenId:", TokenId);
  console.log("Request data:", data);

    try {
        const response=await axios.post("https://sharedapi.tektravels.com/StaticData.svc/rest/GetBusCityList",
            data,
            {headers:{
                "Content-Type":"application/json"
            }
        }
        )
        console.log("External API response:", response.data);
        console.log("External API response structure:", Object.keys(response.data));
             res.json({
      message: "API response is working",
      data: response.data,
    });
        
    } catch (error) {
        console.log(error.response?.data || error.message)
        res.status(500).json({
          error:"BusCityList Failed",
          details:error.response?.data || error.message
        })
    }

}

export const busSearch = async(req,res)=>{

  const {DateOfJourney,DestinationId,EndUserIp,OriginId,TokenId}=req.body
  
  const Data={
    DateOfJourney,
    DestinationId,
    EndUserIp:EndUserIp || getLocalIp(),
    OriginId,
    TokenId
  }

  try {
    const response= await axios.post("https://BusBE.tektravels.com/Busservice.svc/rest/Search",
      Data,
      {headers:{
        "Content-Type":"application/json"
      },
      }
    )
    console.log("BusResults:", JSON.stringify(response.data.BusSearchResult.BusResults, null, 2));
    console.log("External API response structure:", Object.keys(response.data));
    res.json({
      message:"Search API response is working",
      data:response.data
    })
 
  } catch (error) {
    console.log(error.response?.data || error.data)
    res.status(500).json({error:"BusSearch Failed"})
  }
}

export const getBusSeatLayout= async (req,res)=>{

  const {EndUserIp,ResultIndex,TraceId,TokenId}=req.body

    if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data={
    EndUserIp,
    ResultIndex,
    TraceId,
    TokenId
  }

  try {
    const response = await axios.post("https://BusBE.tektravels.com/Busservice.svc/rest/GetBusSeatLayOut",
      Data,
      {
        headers:{"Content-Type":"application/json"}
      }
    )
    console.log("bus Seat Layout  API working")
    console.log("Bus Seat Laout",response.data)
    res.json({
      massage:"Bus Seat Layout API Is working",
      data: response.data
    })
   
  } catch (error) {
    console.log("Bus Seat Layout API error",error.response?.data || error.message)
      res.status(500).json({
      error: "Bus Seat Layout Failed",
      details: error.response?.data || error.message,
    });
  }

}

export const getBusBoardingPoint = async(req, res) =>{

  const { EndUserIp,ResultIndex,TraceId,TokenId}=req.body

      if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data={
  EndUserIp,
  ResultIndex,
  TraceId,
  TokenId,
  }

  try {
    const response = await axios.post("https://BusBE.tektravels.com/Busservice.svc/rest/GetBoardingPointDetails",
      Data,
      {
        headers:{"Content-type": "application/json"}
      }
    )
     console.log("Bus BoardingPoint API is working");
     console.log(response.data.GetBusRouteDetailResult);
    res.json({
      message:"Bus Boardingpoint API is working",
      data:response.data.GetBusRouteDetailResult
    })
    
  } catch (error) {
    res.status(500).json({
      error: "Bus BoardingPoint failed",
      details:error.response?.data  || error.message
    })
    
  }

}

export const busBlock=async(req, res)=>{

    const { EndUserIp,ResultIndex,TraceId,TokenId}=req.body

    if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data={
    EndUserIp,
    ResultIndex,
    TraceId,
    TokenId
  }
  

try{
  const response= await axios("https://BusBE.tektravels.com/Busservice.svc/rest/Block",Data,
    {
  headers:{"Content-type": "application/json"}
      }
    )
     console.log("Bus Block API is working");
     console.log(response.data);
    res.json({
      message:"Bus Block API is working",
      data:response.data
    })
    
  } catch (error) {
    res.status(500).json({
      error: "Bus Block API failed",
      details:error.response?.data  || error.message
    })
  }
}

















































































// export const getBusCityList =async(req,res)=>{

//       try {
//     // Step 1: Authenticate to get TokenId
//     const authData = {
//       ClientId: process.env.BUS_API_CLIENTID,
//       UserName: process.env.BUS_API_USERNAME,
//       Password: process.env.BUS_API_PASSWORD,
//       EndUserIp: getLocalIp(),
//     };

//     const authResponse = await axios.post(
//       "http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate",
//       authData,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const TokenId = authResponse.data?.TokenId;

//     if (!TokenId) {
//       return res.status(500).json({ error: "Failed to get TokenId" });
//     }

//     // Step 2: Call GetBusCityList with TokenId
//     const cityReq = {
//       TokenId,
//       IpAddress: getLocalIp(),
//     };

//         const response=await axios.post("https://sharedapi.tektravels.com/StaticData.svc/rest/GetBusCityList",
//             cityReq,
//             {headers:{
//                 "Content-Type":"application/json"
//             }
//         }
//         )
//              res.json({
//       message: "API response is working",
//       data: response.data,
//     });
        
//     } catch (error) {
//         console.log(error.response?.data || error.message)
//         res.status(500).json({error:"BusCityList Failed"})

        
//     }

// }
