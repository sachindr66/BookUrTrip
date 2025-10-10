// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import MainLayout from "../layoutes/MainLayout";
import { Route, Routes } from "react-router-dom";
import BusPaymentPage from "../features/buses/pages/BusPaymentPage";
import TransferHome from "../features/transfer/pages/TransferHome";
import TransferSearchPage from "../features/transfer/pages/TransferSearchPage";

// Lazy load pages for better performance
const HomePage = lazy(() => import("../features/home/HomePage"));
const FlightsPage = lazy(() => import("../features/flights/pages/FlightsPage"));
const HotelsPage = lazy(() => import("../features/hotels/pages/HotelsPage"));
const BusHomePage = lazy(() => import("../features/buses/pages/BusHomePage"));
const BusResultPage = lazy(() => import("../features/buses/pages/BusResultPage"));
const BusResultsPage = lazy(() => import("../features/buses/pages/BusResultsPage"));
const BusSeatLayoutPage = lazy(() => import("../features/buses/pages/BusSeatLayoutPage"));
const BusBoardingPoint = lazy(() => import("../features/buses/pages/BusBoardingPoint"));
const BusFormDetailsPage = lazy(() => import("../features/buses/pages/BusFormDetailsPage"));
const BusConfirmationPage = lazy(() => import("../features/buses/pages/BusConfirmationPage"));


// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Everything wrapped inside MainLayout */}
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Flight Routes */}
          <Route path="/flights" element={<FlightsPage />} />
          
          {/* Hotel Routes */}
          <Route path="/hotels" element={<HotelsPage />} />
          
          {/* Bus Routes */}
          <Route path="/buses" element={<BusHomePage />} />
          <Route path="/buseResults" element={<BusResultPage />} />
          <Route path="/buseResults1" element={<BusResultsPage />} />
          <Route path="/busSeatLayoutPage" element={<BusSeatLayoutPage />} />
          <Route path="/busBoardingPoint" element={<BusBoardingPoint />} />
          <Route path="/busFormDetailsPage" element={<BusFormDetailsPage />} />
          <Route path="/busPaymentPage" element={<BusPaymentPage />} />
          <Route path="/busConfirmationPage" element={<BusConfirmationPage />} />


          {/* Transfer Rout */}/
          <Route path="/transferHome" element={<TransferHome/>}/>
          <Route path="/TransferSearchPage" element={<TransferSearchPage/>}/>

          

          
          
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
