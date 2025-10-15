import React from 'react';
import { useSelector } from 'react-redux';

const BusConfirmationPage = () => {
  const { busBookData = {}, status, error } = useSelector((state) => state.buses);

  // Correct path to BookResult with safe access
  const bookResult = busBookData?.data?.BookResult;

  // Loading state
  if (status === 'bookloading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boarding points...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-red-800 font-semibold">Error Loading Booking</h3>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // No booking data state
  if (!bookResult) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
        <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-yellow-800 font-semibold text-lg mb-2">No Booking Details Available</h3>
        <p className="text-yellow-600">Please complete a booking first.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'confirmed' || statusLower === 'success') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower === 'failed' || statusLower === 'error') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bus Booking Confirmation</h2>
        <p className="text-gray-600">Your booking has been processed successfully</p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Booking Information</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookResult.BusBookingStatus)}`}>
              {bookResult.BusBookingStatus}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Ticket Number:</span>
                <span className="text-lg font-bold text-blue-600">{bookResult.TicketNo}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Bus ID:</span>
                <span className="text-gray-900">{bookResult.BusId}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Invoice Number:</span>
                <span className="text-gray-900">{bookResult.InvoiceNumber}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Invoice Amount:</span>
                <span className="text-xl font-bold text-green-600">
                  ${parseFloat(bookResult.InvoiceAmount || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Response Status:</span>
                <span className="text-gray-900">{bookResult.ResponseStatus}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Trace ID:</span>
                <span className="text-sm text-gray-500 font-mono">{bookResult.TraceId}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {bookResult.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-red-800">Booking Notice:</span>
              </div>
              <p className="text-red-600 mt-1 ml-7">{bookResult.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
              Print Confirmation
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold">
              Download Ticket
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold">
              Book Another Trip
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Need help? Contact our support team at support@busservice.com
        </p>
      </div>
    </div>
  );
};

export default BusConfirmationPage;