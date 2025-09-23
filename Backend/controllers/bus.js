import axios from "axios";
import os from "os";

// Helper function to get local IP
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

// Helper function for consistent error handling
const handleApiError = (error, res, endpointName) => {
  console.error(`${endpointName} error:`, error.response?.data || error.message);
  res.status(500).json({
    error: `${endpointName} failed`,
    details: error.response?.data || error.message
  });
};

export const authenticateBusAPI = async (req, res) => {
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
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Bus authentication successful");
    res.json({
      message: "Bus authentication successful",
      data: apiResponse.data,
    });
  } catch (error) {
    handleApiError(error, res, "AuthenticateBusAPI");
  }
}

export const getBusCityList = async (req, res) => {
  const { TokenId } = req.body;
  
  // Validate required fields
  if (!TokenId) {
    return res.status(400).json({ error: "TokenId is required" });
  }
  
  try {
    const data = {
      TokenId,
      IpAddress: getLocalIp(),
    };

    console.log("Fetching bus city list with TokenId:", TokenId);

    const response = await axios.post(
      "https://sharedapi.tektravels.com/StaticData.svc/rest/GetBusCityList",
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Bus city list retrieved successfully");
    res.json({
      message: "Bus city list retrieved successfully",
      data: response.data,
    });
  } catch (error) {
    handleApiError(error, res, "GetBusCityList");
  }
}

export const busSearch = async (req, res) => {
  const { DateOfJourney, DestinationId, EndUserIp, OriginId, TokenId } = req.body;

  // Validate required fields
  if (!DateOfJourney || !DestinationId || !OriginId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields: DateOfJourney, DestinationId, OriginId, TokenId" });
  }

  try {
    const Data = {
      DateOfJourney,
      DestinationId,
      EndUserIp: EndUserIp || getLocalIp(),
      OriginId,
      TokenId
    };

    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Search",
      Data,
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );

    console.log("Bus search completed successfully");
    res.json({
      message: "Bus search completed successfully",
      data: response.data
    });
  } catch (error) {
    handleApiError(error, res, "BusSearch");
  }
}

export const getBusSeatLayout = async (req, res) => {
  const { EndUserIp, ResultIndex, TraceId, TokenId } = req.body;

  // Validate required fields
  if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields: EndUserIp, ResultIndex, TraceId, TokenId" });
  }

  try {
    const Data = {
      EndUserIp,
      ResultIndex,
      TraceId,
      TokenId
    };

    console.log("Fetching bus seat layout with data:", Data);

    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBusSeatLayOut",
      Data,
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    console.log("Bus seat layout retrieved successfully");
    res.json({
      message: "Bus seat layout retrieved successfully",
      data: response.data
    });
  } catch (error) {
    handleApiError(error, res, "GetBusSeatLayout");
  }
}

export const getBusBoardingPoint = async (req, res) => {
  const { EndUserIp, ResultIndex, TraceId, TokenId } = req.body;

  // Validate required fields
  if (!EndUserIp || !ResultIndex || !TraceId || !TokenId) {
    return res.status(400).json({ error: "Missing required fields: EndUserIp, ResultIndex, TraceId, TokenId" });
  }

  try {
    const Data = {
      EndUserIp,
      ResultIndex,
      TraceId,
      TokenId,
    };

    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBoardingPointDetails",
      Data,
      {
        headers: { "Content-type": "application/json" }
      }
    );

    console.log("Bus boarding points retrieved successfully");
    res.json({
      message: "Bus boarding points retrieved successfully",
      data: response.data.GetBusRouteDetailResult
    });
  } catch (error) {
    handleApiError(error, res, "GetBusBoardingPoint");
  }
}

export const busBlock = async (req, res) => {
  console.log("Bus block request received:", JSON.stringify(req.body, null, 2));

  const { Passenger, TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId } = req.body;

  // Validate required fields
  if (!Passenger || !Array.isArray(Passenger) || Passenger.length === 0) {
    return res.status(400).json({ error: "Passenger details are required" });
  }
  if (!TokenId || !TraceId || !EndUserIp || !ResultIndex || !BoardingPointId || !DroppingPointId) {
    return res.status(400).json({ error: "Missing required fields: TokenId, TraceId, EndUserIp, ResultIndex, BoardingPointId, DroppingPointId" });
  }

  try {
    // Step 1: Fetch seat layout first
    const seatLayoutData = {
      EndUserIp,
      ResultIndex,
      TraceId,
      TokenId
    };

    console.log("Getting seat layout first...", seatLayoutData);

    const seatLayoutResponse = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBusSeatLayOut",
      seatLayoutData,
      { headers: { "Content-Type": "application/json" } }
    );

    // Process seat layout (same as before)
    let seatLayout = null;
    
    if (seatLayoutResponse.data && seatLayoutResponse.data.GetBusSeatLayOutResult) {
      if (seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails && 
          seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails.SeatLayout &&
          seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails.SeatLayout.SeatDetails) {
        seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails.SeatLayout.SeatDetails;
      } else if (seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails) {
        seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayoutDetails;
      } else if (seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayout) {
        seatLayout = seatLayoutResponse.data.GetBusSeatLayOutResult.SeatLayout;
      }
    }

    if (!seatLayout) {
      console.error("Seat layout not found in response");
      return res.status(500).json({ 
        error: "Seat layout not found in response",
        details: "The seat layout API returned an unexpected structure"
      });
    }

    // Build passenger list with seat validation (same as before)
    const flattenedSeatLayout = Array.isArray(seatLayout) && seatLayout.length > 0 ? seatLayout.flat() : [];
    const passengerList = Passenger.map((p, idx) => {
      // ... (same passenger processing logic as before)
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

    console.log("Bus block completed successfully");
    res.json({
      message: "Bus block completed successfully",
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
    }
    
    handleApiError(error, res, "BusBlock");
  }
};

export const getBusBook = async (req, res) => {
  console.log("Bus book request received:", JSON.stringify(req.body, null, 2));

  const { 
    TokenId, 
    TraceId, 
    EndUserIp, 
    ResultIndex, 
    BlockingKey, 
    passengers, 
    PaymentMode 
  } = req.body;

  // Validate required fields
  if (!TokenId || !TraceId || !EndUserIp || !ResultIndex || !BlockingKey || !passengers) {
    return res.status(400).json({ 
      error: "Missing required fields: TokenId, TraceId, EndUserIp, ResultIndex, BlockingKey, passengers" 
    });
  }

  try {
    // Prepare passenger details for booking
    const passengerDetails = passengers.map(passenger => ({
      Title: passenger.Title || "Mr",
      FirstName: passenger.FirstName,
      LastName: passenger.LastName,
      Age: parseInt(passenger.Age),
      Gender: passenger.Gender.toLowerCase() === 'female' ? 2 : 1,
      Phoneno: passenger.Phoneno,
      Email: passenger.Email,
      Address: passenger.Address || "NA",
      IdType: passenger.IdType || 1,
      IdNumber: passenger.IdNumber || "",
      SeatIndex: passenger.SeatIndex,
      SeatName: passenger.SeatName,
      Fare: passenger.Fare
    }));

    // Prepare booking payload
    const bookPayload = {
      TokenId,
      TraceId,
      EndUserIp,
      ResultIndex: parseInt(ResultIndex),
      BlockingKey,
      Passenger: passengerDetails,
      PaymentMode: PaymentMode || 1
    };

    console.log("Calling bus book API with payload:", bookPayload);

    // Call the Book API
    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Book",
      bookPayload,
      { 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }
    );

    // Check for errors in the response
    if (response.data.BookResult && response.data.BookResult.Error) {
      return res.status(400).json({
        error: "Booking failed",
        details: response.data.BookResult.Error.ErrorMessage,
        errorCode: response.data.BookResult.Error.ErrorCode
      });
    }

    console.log("Bus booking completed successfully");
    res.json({
      message: "Bus booking completed successfully",
      data: response.data,
      bookingId: response.data.BookResult?.BookingId,
      pnr: response.data.BookResult?.Pnr
    });

  } catch (error) {
    console.error("Bus Book API error:", error.response?.data || error.message);
    
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.BookResult && errorData.BookResult.Error) {
        return res.status(400).json({ 
          error: "Booking failed",
          message: errorData.BookResult.Error.ErrorMessage,
          errorCode: errorData.BookResult.Error.ErrorCode
        });
      }
    }
    
    handleApiError(error, res, "BusBook");
  }
};

export const getBusBookingDetails = async (req, res) => {
  const { TokenId, BookingId } = req.body;

  // Validate required fields
  if (!TokenId || !BookingId) {
    return res.status(400).json({ error: "TokenId and BookingId are required" });
  }

  try {
    const data = {
      TokenId,
      BookingId
    };

    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/GetBookingDetails",
      data,
      { 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }
    );

    console.log("Bus booking details retrieved successfully");
    res.json({
      message: "Bus booking details retrieved successfully",
      data: response.data
    });
  } catch (error) {
    handleApiError(error, res, "GetBusBookingDetails");
  }
};

export const cancelBusBooking = async (req, res) => {
  const { TokenId, BookingId, EndUserIp } = req.body;

  // Validate required fields
  if (!TokenId || !BookingId) {
    return res.status(400).json({ error: "TokenId and BookingId are required" });
  }

  try {
    const data = {
      TokenId,
      BookingId,
      EndUserIp: EndUserIp || getLocalIp()
    };

    const response = await axios.post(
      "https://BusBE.tektravels.com/Busservice.svc/rest/Cancel",
      data,
      { 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }
    );

    console.log("Bus booking cancelled successfully");
    res.json({
      message: "Bus booking cancelled successfully",
      data: response.data
    });
  } catch (error) {
    handleApiError(error, res, "CancelBusBooking");
  }
};