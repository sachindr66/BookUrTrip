import React, { useState } from 'react'

const BusFormDetailsPage = () => {

  const [showGSTDetails, setShowGSTDetails] = useState(false);

  return (
    <form className="space-y-6">
      {/* Traveler Details */}
      <div className="border rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-user"></i> Traveler Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <select className="mt-1 w-full border rounded-lg p-2">
              <option value="">Select</option>
              <option>Mr</option>
              <option>Mrs</option>
              <option>Miss</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">First Name *</label>
            <input
              type="text"
              placeholder="Enter first name"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name *</label>
            <input
              type="text"
              placeholder="Enter last name"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age *</label>
            <input
              type="number"
              placeholder="Age"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender *</label>
            <select className="mt-1 w-full border rounded-lg p-2">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="border rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-phone"></i> Contact Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Email ID *</label>
            <input
              type="email"
              placeholder="Enter email"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number *</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* GST Toggle */}
        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showGSTDetails}
              onChange={(e) => setShowGSTDetails(e.target.checked)}
              className="h-4 w-4"
            />
            Add GST Details (Optional)
          </label>
        </div>

        {showGSTDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">GST Number</label>
              <input
                type="text"
                placeholder="Enter GST number"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                placeholder="Enter company name"
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* Address Details */}
      <div className="border rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <i className="fas fa-map-marker-alt"></i> Address Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Address *</label>
            <input
              type="text"
              placeholder="Enter address"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State *</label>
            <select className="mt-1 w-full border rounded-lg p-2">
              <option value="">Select State</option>
              <option>Delhi</option>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Tamil Nadu</option>
              <option>Uttar Pradesh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Country *</label>
            <input
              type="text"
              placeholder="Enter country"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City *</label>
            <input
              type="text"
              placeholder="Enter city"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pincode *</label>
            <input
              type="text"
              placeholder="Enter pincode"
              className="mt-1 w-full border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Proceed to Payment
        </button>
      </div>
    </form>
  );
};



export default BusFormDetailsPage
