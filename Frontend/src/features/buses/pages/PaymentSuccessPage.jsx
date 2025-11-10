import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // ✅ Correct import
import { fetchBusBook } from "../busesSlice";

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const bookingData = location.state?.bookingData;
    if (bookingData) {
      dispatch(fetchBusBook(bookingData))
        .unwrap()
        .then((res) => {
          navigate("/busConfirmationPage", { state: { busBookData: res } });
        })
        .catch(() => alert("Booking failed. Try again."));
    }
  }, [dispatch, location, navigate]);

  return (
    <div className="text-center py-10">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-600 mt-2">Finalizing your booking...</p>
    </div>
  );
};

export default PaymentSuccessPage;
