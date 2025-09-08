import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaSearch, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authenticateBus, fetchBusCityList, fetchSearch } from "../busesSlice";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";


const BusSearchPage = () => {

  const dispatch = useDispatch();
  const navigate=useNavigate()

  const { tokenId, cities=[],searchResults:[], status, error } = useSelector(
    (state) => state.buses
  );


  // States
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("");

  const [activeDropdown, setActiveDropdown] = useState(null);

  // separate states for inputs
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const dropdownRef = useRef();

  // Prefill from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("busSearch");
    if (stored) {
      const { fromLocation, toLocation, travelDate } = JSON.parse(stored);
      if (fromLocation) setFromLocation(fromLocation);
      if (toLocation) setToLocation(toLocation);
      if (travelDate) setTravelDate(travelDate);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "busSearch",
      JSON.stringify({ fromLocation, toLocation, travelDate })
    );
  }, [fromLocation, toLocation, travelDate]);

  // Fetch API auth + city list
  useEffect(() => {
    dispatch(authenticateBus());
  }, [dispatch]);

  useEffect(() => {
    if (tokenId) {
      dispatch(fetchBusCityList(tokenId));
    }
  }, [tokenId, dispatch]);

  // Debounced search
  const debouncedFromSearch = useMemo(
    () => debounce((val) => setFromSearch(val), 300),
    []
  );
  const debouncedToSearch = useMemo(
    () => debounce((val) => setToSearch(val), 300),
    []
  );

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities
  const filterCities = (term) => {
    if (!term) return cities;

    const lower = term.toLowerCase();
    return cities
      .filter((c) => c.CityName.toLowerCase().includes(lower))
      .sort((a, b) => {
        const aName = a.CityName.toLowerCase();
        const bName = b.CityName.toLowerCase();
        if (aName === lower && bName !== lower) return -1;
        if (bName === lower && aName !== lower) return 1;
        if (aName.startsWith(lower) && !bName.startsWith(lower)) return -1;
        if (bName.startsWith(lower) && !aName.startsWith(lower)) return 1;
        return 0;
      });
  };

  const filteredFromCities = useMemo(
    () => filterCities(fromSearch),
    [fromSearch, cities]
  );
  const filteredToCities = useMemo(
    () => filterCities(toSearch),
    [toSearch, cities]
  );

  const handleSelectCity = (city, type) => {
    if (type === "from") {
      setFromLocation({id:city.CityId, name:city.CityName});
      setFromInput("");
    }
    if (type === "to") {
      setToLocation({id:city.CityId, name:city.CityName});
      setToInput("");
    }
    setActiveDropdown(null);
  };

  const handleSwap = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSearch =async () => {
    if (!fromLocation?.id || !toLocation?.id || !travelDate) {
      alert("Please select From, To and Date");
      return;
    }

      if (!tokenId) {
    alert("Authentication failed. Please try again.");
    return;
  }

    console.log("Searching buses:", { fromLocation, toLocation, travelDate });
    // dispatch fetch buses here
    try {
    const result= await (dispatch(fetchSearch({
      OriginId:fromLocation.id,
      DestinationId:toLocation.id,
      DateOfJourney:travelDate,
      EndUserIp: "192.168.1.1", 
      TokenId: tokenId,
    }))
    )
    if(fetchSearch.fulfilled.match(result)){
      navigate('/buseResults1')
    }else{
      console.log("Search Failed", result.payload || result.error)
      alert("No buses found or API failed.");
    }
  }
    catch(error){
      console.error("Search failed", error)

    }

  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
        {status === "loading" && <p>Loading cities...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* From */}
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              From
            </label>
            <input
              type="text"
              placeholder="Type city..."
              value={activeDropdown === "from" ? fromInput : fromLocation?.name || ""}
              onChange={(e) => {
                setFromInput(e.target.value);
                debouncedFromSearch(e.target.value);
              }}
              onFocus={() => setActiveDropdown("from")}
              className="input-field w-full"
            />
            {activeDropdown === "from" && (
              <ul className="absolute w-full bg-white text-gray-600 border rounded mt-1 max-h-40 overflow-y-auto z-10">
                {filteredFromCities.length > 0 ? (
                  filteredFromCities.map((c) => (
                    <li
                      key={c.CityId}
                      onClick={() => handleSelectCity(c, "from")}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {c.CityName}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No cities found</li>
                )}
              </ul>
            )}
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full bg-white shadow hover:scale-110 border transition"
            >
              <FaExchangeAlt className="h-5 w-5 text-primary-600" />
            </button>
          </div>

          {/* To */}
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              To
            </label>
            <input
              type="text"
              placeholder="Type city..."
              value={activeDropdown === "to" ? toInput : toLocation?.name}
              onChange={(e) => {
                setToInput(e.target.value);
                debouncedToSearch(e.target.value);
              }}
              onFocus={() => setActiveDropdown("to")}
              className="input-field w-full"
            />
            {activeDropdown === "to" && (
              <ul className="absolute w-full bg-white text-gray-600 border rounded mt-1 max-h-40 overflow-y-auto z-10">
                {filteredToCities.length > 0 ? (
                  filteredToCities.map((c) => (
                    <li
                      key={c.CityId}
                      onClick={() => handleSelectCity(c, "to")}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {c.CityName}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-gray-500">No cities found</li>
                )}
              </ul>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSearch}
            className="btn-primary px-12 py-4 text-lg font-semibold flex items-center justify-center mx-auto hover:scale-105 transition"
          >
            <FaSearch className="mr-2" />
            Search Buses
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusSearchPage;

