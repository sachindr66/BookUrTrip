import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authenticateTransfer, countryList } from "../transferSlice";

const TransferSearchPage = () => {
  const dispatch = useDispatch();
  const { tokenId, status, error, countrylist = [] } = useSelector(
    (state) => state.transfer
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Authenticate
  useEffect(() => {
    dispatch(authenticateTransfer());
  }, [dispatch]);

  // Fetch countries after authentication
  useEffect(() => {
    if (tokenId && tokenId.length > 0) {
      dispatch(countryList(tokenId));
    }
  }, [dispatch, tokenId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sort countries: matches first, then others alphabetically
  const sortedCountries = [...countrylist].sort((a, b) => {
    const aMatch = a.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const bMatch = b.Name.toLowerCase().includes(searchTerm.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return a.Name.localeCompare(b.Name);
  });

  // Check if any matches exist
  const hasMatches = countrylist.some((country) =>
    country.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (country) => {
    setSearchTerm(country.Name);
    setDropdownOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* AUTHENTICATION STATUS */}
      {status === "authLoading" && <p>Authenticating transfer...</p>}
      {status === "authFailed" && <p style={{ color: "red" }}>{error}</p>}
      {status === "authSucceeded" && (
        <p>Transfer token received successfully.</p>
      )}

      {/* COUNTRY LIST */}
      <div ref={dropdownRef} className="relative w-full max-w-md">
        <h1 className="font-semibold text-lg mb-2">Country List</h1>

        <input
          type="text"
          placeholder="Select or search country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
        />

        {/* DROPDOWN */}
        {dropdownOpen && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-56 overflow-y-auto shadow-md">
            {status === "countryLoading" ? (
              <li className="p-2 text-gray-500">Loading countries...</li>
            ) : searchTerm && !hasMatches ? (
              <li className="p-2 text-gray-500">No countries found</li>
            ) : (
              sortedCountries.map((country, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(country)}
                  className={`p-2 cursor-pointer hover:bg-blue-100 ${
                    country.Name.toLowerCase().includes(searchTerm.toLowerCase())
                      ? "font-bold text-blue-600"
                      : ""
                  }`}
                >
                  {country.Name} ({country.Code})
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransferSearchPage;
