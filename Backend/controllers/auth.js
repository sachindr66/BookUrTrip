import axios from "axios";
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

export const authenticateBusAPI = async (req, res) => {
  const data = {
    "ClientId": process.env.BUS_API_CLIENTID,
    "UserName": process.env.BUS_API_USERNAME,
    "Password": process.env.BUS_API_PASSWORD,
    "EndUserIp": getLocalIp(),
  }

  try {
    const apiResponse = await axios.post(
      'http://sharedapi.tektravels.com/SharedData.svc/rest/Authenticate',
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    res.json({
      message: "API response is working",
      data: apiResponse.data,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ error: "Authentication failed" })
  }
}


export const getBusCityList = async (req, res) => {
  const { TokenId } = req.body;
  
  if (!TokenId) {
    return res.status(400).json({ error: "TokenId is required" });
  }
  
  const data = {
    TokenId,
    IpAddress: getLocalIp(),
  };

  console.log("getBusCityList called with TokenId:", TokenId);
  console.log("Request data:", data);

  try {
    const response = await axios.post(
      "https://sharedapi.tektravels.com/StaticData.svc/rest/GetBusCityList",
      data,
      {
        headers: {
          "Content-Type": "application/json"
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
      error: "BusCityList Failed",
      details: error.response?.data || error.message
    })
  }
}

export const busSearch = async (req, res) => {
  const { DateOfJourney, DestinationId, EndUserIp, OriginId, TokenId } = req.body

  // Validate required fields
  if (!DateOfJourney || !DestinationId || !OriginId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data = {
    DateOfJourney,
    DestinationId,
    EndUserIp: EndUserIp || getLocalIp(),
    OriginId,
    TokenId
  }

  try {
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Search",
      Data,
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    )
    console.log("BusResults:", JSON.stringify(response.data.BusSearchResult.BusResults, null, 2));
    console.log("External API response structure:", Object.keys(response.data));
    res.json({
      message: "Search API response is working",
      data: response.data
    })
  } catch (error) {
    console.log(error.response?.data || error.message)
    res.status(500).json({
      error: "BusSearch Failed",
      details: error.response?.data || error.message
    })
  }
}

export const getBusSeatLayout = async (req, res) => {
  const { EndUserIp, ResultIndex, TraceId, TokenId } = req.body

  if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data = {
    EndUserIp,
    ResultIndex,
    TraceId,
    TokenId
  }

  console.log("Seat Layout API request data:", Data);

  try {
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBusSeatLayOut",
      Data,
      {
        headers: { "Content-Type": "application/json" }
      }
    )
    console.log("bus Seat Layout API working")
    console.log("Bus Seat Layout response:", JSON.stringify(response.data, null, 2))
    console.log("Response structure keys:", Object.keys(response.data || {}))
    
    res.json({
      message: "Bus Seat Layout API Is working",
      data: response.data
    })
  } catch (error) {
    console.log("Bus Seat Layout API error", error.response?.data || error.message)
    res.status(500).json({
      error: "Bus Seat Layout Failed",
      details: error.response?.data || error.message,
    });
  }
}

export const getBusBoardingPoint = async (req, res) => {
  const { EndUserIp, ResultIndex, TraceId, TokenId } = req.body

  if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const Data = {
    EndUserIp,
    ResultIndex,
    TraceId,
    TokenId,
  }

  try {
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBoardingPointDetails",
      Data,
      {
        headers: { "Content-type": "application/json" }
      }
    )
    console.log("Bus BoardingPoint API is working");
    console.log(response.data.GetBusRouteDetailResult);
    res.json({
      message: "Bus Boardingpoint API is working",
      data: response.data.GetBusRouteDetailResult
    })
  } catch (error) {
    res.status(500).json({
      error: "Bus BoardingPoint failed",
      details: error.response?.data || error.message
    })
  }
}


// Wrapper function for simplified bus block API
// export const busBlockSimple = async (req, res) => {
//   const { EndUserIp, ResultIndex, TraceId, TokenId, passengers } = req.body;

//   if (!EndUserIp || !ResultIndex || !TraceId || !TokenId || !passengers || !Array.isArray(passengers)) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   // Transform the simplified input to the format expected by the working busBlock function
//   const transformedRequest = {
//     EndUserIp,
//     ResultIndex: parseInt(ResultIndex),
//     TraceId,
//     TokenId,
//     BoardingPointId: 1, // Default or get from request
//     DroppingPointId: 1, // Default or get from request
//     Passenger: passengers.map(p => ({
//       Title: p.Title || "Mr",
//       FirstName: p.Name?.split(' ')[0] || p.FirstName || "",
//       LastName: p.Name?.split(' ').slice(1).join(' ') || p.LastName || "",
//       Age: parseInt(p.Age),
//       Gender: p.Gender,
//       Phoneno: p.Mobile || p.Phoneno || "",
//       Email: p.Email,
//       Address: p.Address || "NA",
//       Seat: {
//         SeatIndex: p.SeatId || p.SeatIndex,
//         SeatName: p.SeatName
//       }
//     }))
//   };

//   // Call the working busBlock function
//   return busBlock({ body: transformedRequest }, res);
// };

export const busBlock = async (req, res) => {
  const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

  // Basic validation
  if (!Passenger || !Array.isArray(Passenger) || Passenger.length === 0) {
    return res.status(400).json({ error: "Passenger details are required" });
  }
  if (!TokenId || !TraceId || !EndUserIp || !ResultIndex || !BoardingPointId || !DroppingPointId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Fetch seat layout
    const seatLayoutData = {
      EndUserIp,
      ResultIndex,
      TraceId,
      TokenId
    };

    const seatLayoutResponse = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBusSeatLayOut",
      seatLayoutData,
      { headers: { "Content-Type": "application/json" } }
    );

    // Extract seat layout from response
    let seatLayout = null;
    if (seatLayoutResponse.data?.GetBusSeatLayOutResult?.SeatLayoutDetails?.SeatLayout?.SeatDetails) {
      seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails.SeatLayout.SeatDetails;
    } else if (seatLayoutResponse.data?.GetBusSeatLayOutResult?.SeatLayoutDetails) {
      seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails;
    } else if (seatLayoutResponse.data?.GetBusSeatLayOutResult?.SeatLayout) {
      seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayout;
    }

    if (!seatLayout || !Array.isArray(seatLayout) || seatLayout.length === 0) {
      return res.status(500).json({ 
        error: "Seat layout not found or invalid",
        details: "Unable to retrieve seat layout data"
      });
    }

    // Flatten the seat layout array structure
    const flattenedSeatLayout = seatLayout.flat();

    // Build Passenger list with seat validation
    const passengerList = Passenger.map((p, idx) => {
      // Mark the first passenger as primary
      const isPrimary = idx === 0;

      // Validate required passenger fields
      if (!p.FirstName || !p.LastName || !p.Age || !p.Gender || !p.Phoneno || !p.Email) {
        throw new Error(`Passenger ${idx + 1} is missing required fields: FirstName, LastName, Age, Gender, Phoneno, Email`);
      }

      // ID fields validation
      if ((p.IdType && !p.IdNumber) || (p.IdNumber && !p.IdType)) {
        throw new Error(`Passenger ${idx + 1}: If ID information is provided, both IdType and IdNumber are required`);
      }

      // Convert SeatIndex
      let seatIndex = p.Seat?.SeatIndex;
      if (!seatIndex) {
        throw new Error(`Passenger ${idx + 1}: SeatIndex is required`);
      }

      if (typeof seatIndex === "string") {
        seatIndex = parseInt(seatIndex);
      }

      if (isNaN(seatIndex) || seatIndex <= 0) {
        throw new Error(`Passenger ${idx + 1}: Invalid SeatIndex format`);
      }

      // Find seat in layout
      const seatDetails = flattenedSeatLayout.find(s => s.SeatIndex === seatIndex);
      if (!seatDetails) {
        throw new Error(`Passenger ${idx + 1}: SeatIndex ${seatIndex} not found in seat layout`);
      }

      // Validate price information
      const publishedPrice = seatDetails.Price?.PublishedPriceRoundedOff || 
                           seatDetails.Price?.PublishedPrice || 
                           seatDetails.SeatFare;
      
      if (!seatDetails.Price || !publishedPrice || publishedPrice <= 0) {
        throw new Error(`Seat ${seatIndex}: Missing or invalid price information`);
      }

      // Convert Gender to integer (1 = Male, 2 = Female)
      let genderInt = 1;
      if (p.Gender) {
        const genderStr = p.Gender.toString().toLowerCase();
        if (genderStr === 'f' || genderStr === 'female') {
          genderInt = 2;
        } else if (genderStr === 'm' || genderStr === 'male') {
          genderInt = 1;
        }
      }

      // Check if the request already has complete seat data with price information
      const hasCompleteSeatData = p.Seat && p.Seat.Price && p.Seat.Price.PublishedPrice;
      
      // Use seat details from layout if not provided in request
      return {
        LeadPassenger: isPrimary,
        PassengerId: 0,
        Title: p.Title || "Mr",
        FirstName: p.FirstName,
        LastName: p.LastName,
        Age: parseInt(p.Age),
        Gender: genderInt,
        Phoneno: p.Phoneno,
        Email: p.Email,
        Address: p.Address || "NA",
        // Use the complete seat object structure from the working reference
        Seat: {
          ColumnNo: p.Seat?.ColumnNo || seatDetails.ColumnNo || "003",
          Height: p.Seat?.Height || seatDetails.Height || 1,
          IsLadiesSeat: p.Seat?.IsLadiesSeat || seatDetails.IsLadiesSeat || false,
          IsMalesSeat: p.Seat?.IsMalesSeat || seatDetails.IsMalesSeat || false,
          IsUpper: p.Seat?.IsUpper || seatDetails.IsUpper || false,
          RowNo: p.Seat?.RowNo || seatDetails.RowNo || "002",
          SeatFare: parseInt(p.Seat?.SeatFare || seatDetails.SeatFare || 0),
          SeatIndex: seatIndex,
          SeatName: p.Seat?.SeatName || seatDetails.SeatName,
          SeatStatus: p.Seat?.SeatStatus || seatDetails.SeatStatus || true,
          SeatType: p.Seat?.SeatType || seatDetails.SeatType || 1,
          Width: p.Seat?.Width || seatDetails.Width || 1,
          Price: hasCompleteSeatData ? {
            // Use the price data from the request if it's complete
            CurrencyCode: p.Seat.Price.CurrencyCode || "INR",
            BasePrice: parseFloat(p.Seat.Price.BasePrice || 0),
            Tax: parseFloat(p.Seat.Price.Tax || 0),
            OtherCharges: parseFloat(p.Seat.Price.OtherCharges || 0),
            Discount: parseFloat(p.Seat.Price.Discount || 0),
            PublishedPrice: parseFloat(p.Seat.Price.PublishedPrice || 0),
            PublishedPriceRoundedOff: parseFloat(p.Seat.Price.PublishedPriceRoundedOff || 0),
            OfferedPrice: parseFloat(p.Seat.Price.OfferedPrice || 0),
            OfferedPriceRoundedOff: parseFloat(p.Seat.Price.OfferedPriceRoundedOff || 0),
            AgentCommission: parseFloat(p.Seat.Price.AgentCommission || 0),
            AgentMarkUp: parseFloat(p.Seat.Price.AgentMarkUp || 0),
            TDS: parseFloat(p.Seat.Price.TDS || 0),
            GST: p.Seat.Price.GST ? {
              CGSTAmount: parseInt(p.Seat.Price.GST.CGSTAmount || 0),
              CGSTRate: parseInt(p.Seat.Price.GST.CGSTRate || 0),
              CessAmount: parseInt(p.Seat.Price.GST.CessAmount || 0),
              CessRate: parseInt(p.Seat.Price.GST.CessRate || 0),
              IGSTAmount: parseInt(p.Seat.Price.GST.IGSTAmount || 0),
              IGSTRate: parseInt(p.Seat.Price.GST.IGSTRate || 0),
              SGSTAmount: parseInt(p.Seat.Price.GST.SGSTAmount || 0),
              SGSTRate: parseInt(p.Seat.Price.GST.SGSTRate || 0),
              TaxableAmount: parseInt(p.Seat.Price.GST.TaxableAmount || 0)
            } : null
          } : (seatDetails.Price ? {
            // Use price data from seat layout
            CurrencyCode: seatDetails.Price.CurrencyCode || "INR",
            BasePrice: parseFloat(seatDetails.Price.BasePrice || publishedPrice),
            Tax: parseFloat(seatDetails.Price.Tax || 0),
            OtherCharges: parseFloat(seatDetails.Price.OtherCharges || 0),
            Discount: parseFloat(seatDetails.Price.Discount || 0),
            PublishedPrice: parseFloat(seatDetails.Price.PublishedPrice || publishedPrice),
            PublishedPriceRoundedOff: parseFloat(seatDetails.Price.PublishedPriceRoundedOff || publishedPrice),
            OfferedPrice: parseFloat(seatDetails.Price.OfferedPrice || publishedPrice),
            OfferedPriceRoundedOff: parseFloat(seatDetails.Price.OfferedPriceRoundedOff || publishedPrice),
            AgentCommission: parseFloat(seatDetails.Price.AgentCommission || 0),
            AgentMarkUp: parseFloat(seatDetails.Price.AgentMarkUp || 0),
            TDS: parseFloat(seatDetails.Price.TDS || 0),
            GST: seatDetails.Price.GST ? {
              CGSTAmount: parseInt(seatDetails.Price.GST.CGSTAmount || 0),
              CGSTRate: parseInt(seatDetails.Price.GST.CGSTRate || 0),
              CessAmount: parseInt(seatDetails.Price.GST.CessAmount || 0),
              CessRate: parseInt(seatDetails.Price.GST.CessRate || 0),
              IGSTAmount: parseInt(seatDetails.Price.GST.IGSTAmount || 0),
              IGSTRate: parseInt(seatDetails.Price.GST.IGSTRate || 0),
              SGSTAmount: parseInt(seatDetails.Price.GST.SGSTAmount || 0),
              SGSTRate: parseInt(seatDetails.Price.GST.SGSTRate || 0),
              TaxableAmount: parseInt(seatDetails.Price.GST.TaxableAmount || 0)
            } : null
          } : {
            // Fallback price object
            CurrencyCode: "INR",
            BasePrice: parseFloat(publishedPrice),
            Tax: 0,
            OtherCharges: 0,
            Discount: 0,
            PublishedPrice: parseFloat(publishedPrice),
            PublishedPriceRoundedOff: parseFloat(publishedPrice),
            OfferedPrice: parseFloat(publishedPrice),
            OfferedPriceRoundedOff: parseFloat(publishedPrice),
            AgentCommission: 0,
            AgentMarkUp: 0,
            TDS: 0,
            GST: null
          })
        }
      };
    });

    // Final payload
    const blockPayload = {
      EndUserIp,
      ResultIndex: parseInt(ResultIndex),
      TraceId,
      TokenId,
      BoardingPointId: parseInt(BoardingPointId),
      DroppingPointId: parseInt(DroppingPointId),
      Passenger: passengerList
    };

    // Call Block API
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Block",
      blockPayload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Bus Block Data", response.data)
    res.json({
      message: "Bus Block API success",
      data: response.data
    });

  } catch (error) {
    console.error("Bus Block API error:", error.response?.data || error.message);
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.BlockResult && errorData.BlockResult.Error) {
        return res.status(400).json({ 
          message: errorData.BlockResult.Error.ErrorMessage,
          errorCode: errorData.BlockResult.Error.ErrorCode
        });
      }
      return res.status(500).json({
        error: "Bus Block API failed",
        details: errorData
      });
    }
    
    res.status(500).json({
      error: "Bus Block API failed",
      details: error.message
    });
  }
};




export const getBusBook = async (req, res) => {
  console.log("Booking request received:", req.body);
  
  const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

  // Validate required fields
  if (!Passenger || !TokenId || !TraceId || !EndUserIp || !ResultIndex || !BoardingPointId || !DroppingPointId) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  const Data = {
    Passenger,
    TokenId,
    TraceId,
    EndUserIp,
    ResultIndex,
    BoardingPointId,
    DroppingPointId,
  }

  try {
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Book", 
      Data,
      {
        headers: { "Content-type": "application/json" }
      }
    );

    console.log("External Bus Booking API response:", response.data);
    
    // Return the complete response from external API
    res.json({
      message: "Bus Booking API is working",
      data: response.data  // This should match what your frontend expects
    });

  } catch (error) {
    console.error("Bus Booking API error:", error.response?.data || error.message);
    
    res.status(500).json({
      error: "Bus Booking failed",
      details: error.response?.data || error.message
    });
  }
}






// export const getBusBook= async(req, res)=>{

//   const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

//   const Data={
//     Passenger,
//     TokenId,
//     TraceId,
//     EndUserIp,
//     ResultIndex,
//     BoardingPointId,
//     DroppingPointId,
//   }
//   try {
//     const response= await axios.post("https://BusBE.tektravels.com/Busservice.svc/rest/Book", Data,
//       {
//        headers: { "Content-type":"application/json"}
//       }
//     )
//       console.log("Bus Booking Data",response.data)
//       res.json({
//         message:"Bus Booking API is working",
//         details:response.data
//       })

//     } catch (error) {
//       res.status(500).json({
//       error: "Bus Booking failed",
//       details: error.response?.data || error.message
//     })
    
//   }
// }











// export const getBusBook = async (req, res) => {
//   const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

//   // Basic validation
//   if (!Passenger || !Array.isArray(Passenger) || Passenger.length === 0) {
//     return res.status(400).json({ error: "Passenger details are required" });
//   }
//   if (!TokenId || !TraceId || !EndUserIp || !ResultIndex || !BoardingPointId || !DroppingPointId) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   const Data = {
//     Passenger,
//     TokenId,
//     TraceId,
//     EndUserIp,
//     ResultIndex: parseInt(ResultIndex),
//     BoardingPointId: parseInt(BoardingPointId),
//     DroppingPointId: parseInt(DroppingPointId),
//   }

//   try {
//     const response = await axios.post(
//       "https://BusBE.tektravels.com/Busservice.svc/rest/Book", 
//       Data,
//       {
//         headers: { "Content-Type": "application/json" }
//       }
//     )
    
//     console.log("Bus Booking Data", response.data)
    
//     // Check if booking was successful
//     if (response.data?.BookResult?.ResponseStatus === 1) {
//       res.json({
//         message: "Bus Booking API success",
//         data: response.data
//       })
//     } else {
//       // Handle booking failure
//       const errorMessage = response.data?.BookResult?.Error?.ErrorMessage || "Booking failed";
//       const errorCode = response.data?.BookResult?.Error?.ErrorCode || 0;
      
//       return res.status(400).json({
//         message: errorMessage,
//         errorCode: errorCode,
//         details: response.data
//       })
//     }

//   } catch (error) {
//     console.error("Bus Booking API error:", error.response?.data || error.message);
    
//     if (error.response && error.response.data) {
//       const errorData = error.response.data;
//       if (errorData.BookResult && errorData.BookResult.Error) {
//         return res.status(400).json({ 
//           message: errorData.BookResult.Error.ErrorMessage,
//           errorCode: errorData.BookResult.Error.ErrorCode
//         });
//       }
//       return res.status(500).json({
//         error: "Bus Booking API failed",
//         details: errorData
//       });
//     }
    
//     res.status(500).json({
//       error: "Bus Booking failed",
//       details: error.message
//     })
//   }
// }s




// export const busBlock = async (req, res) => {
//   const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

//   // Basic validation
//   if (!Passenger || !Array.isArray(Passenger) || Passenger.length === 0) {
//     return res.status(400).json({ error: "Passenger details are required" });
//   }
//   if (!TokenId || !TraceId || !EndUserIp || !ResultIndex || !BoardingPointId || !DroppingPointId) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     // Process passengers - use the data directly since it's already complete
//     const passengerList = Passenger.map((p, idx) => ({
//       LeadPassenger: idx === 0,
//       PassengerId: 0,
//       Title: p.Title || "Mr",
//       FirstName: p.FirstName,
//       LastName: p.LastName,
//       Age: parseInt(p.Age),
//       Gender: typeof p.Gender === 'number' ? p.Gender : (p.Gender?.toString().toLowerCase() === 'f' || p.Gender?.toString().toLowerCase() === 'female' ? 2 : 1),
//       Phoneno: p.Phoneno,
//       Email: p.Email,
//       Address: p.Address || "NA",
//       Seat: p.Seat // Use the complete seat data as provided
//     }));

//     // Call Block API directly
//     const response = await axios.post(
//       "https://BusBE.tektravels.com/Busservice.svc/rest/Block",
//       {
//         EndUserIp,
//         ResultIndex: parseInt(ResultIndex),
//         TraceId,
//         TokenId,
//         BoardingPointId: parseInt(BoardingPointId),
//         DroppingPointId: parseInt(DroppingPointId),
//         Passenger: passengerList
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     res.json({
//       message: "Bus Block API success",
//       data: response.data
//     });

//   } catch (error) {
//     console.error("Bus Block API error:", error.response?.data || error.message);
    
//     if (error.response?.data?.BlockResult?.Error) {
//       return res.status(400).json({ 
//         message: error.response.data.BlockResult.Error.ErrorMessage,
//         errorCode: error.response.data.BlockResult.Error.ErrorCode
//       });
//     }
    
//     res.status(500).json({
//       error: "Bus Block API failed",
//       details: error.message
//     });
//   }
// };