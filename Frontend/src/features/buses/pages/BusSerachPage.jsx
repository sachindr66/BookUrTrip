import React, { useState, useEffect, useMemo, useRef } from "react";
import { FaSearch, FaExchangeAlt, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { authenticateBus, fetchBusCityList, fetchSearch } from "../busesSlice";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";

const BusSearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tokenId, cities = [], searchResults = [], status, error } = useSelector(
    (state) => state.buses
  );

  // States
  const [fromLocation, setFromLocation] = useState({ id: null, name: "Delhi" });
  const [toLocation, setToLocation] = useState({ id: null, name: "Jaipur" });
  const [travelDate, setTravelDate] = useState("");
  const [selectedSeatType, setSelectedSeatType] = useState("");
  const [showACOnly, setShowACOnly] = useState(false);
  const [selectedDateTab, setSelectedDateTab] = useState(1);

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Separate states for inputs
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const dropdownRef = useRef();
  const dateInputRef = useRef();

  // Generate date tabs
  const generateDateTabs = () => {
    const today = new Date();
    const tabs = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      const dayNumber = date.getDate();
      
      let label = `${dayNumber} ${dayName}`;
      if (i === 0) label = `${dayNumber} Today`;
      
      tabs.push({
        label,
        date: date.toISOString().split('T')[0],
        dayName,
        dayNumber
      });
    }
    
    return tabs;
  };

  const dateTabs = generateDateTabs();

  // Initialize travel date
  useEffect(() => {
    if (dateTabs[selectedDateTab] && !travelDate) {
      setTravelDate(dateTabs[selectedDateTab].date);
    }
  }, [selectedDateTab]);

  // Prefill from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("busSearch");
    if (stored) {
      const { fromLocation, toLocation, travelDate } = JSON.parse(stored);
      if (fromLocation) setFromLocation(fromLocation);
      if (toLocation) setToLocation(toLocation);
      if (travelDate) {
        setTravelDate(travelDate);
        // Find the tab index for the stored date
        const tabIndex = dateTabs.findIndex(tab => tab.date === travelDate);
        if (tabIndex !== -1) {
          setSelectedDateTab(tabIndex);
        }
      }
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
      setFromLocation({ id: city.CityId, name: city.CityName });
      setFromInput("");
    }
    if (type === "to") {
      setToLocation({ id: city.CityId, name: city.CityName });
      setToInput("");
    }
    setActiveDropdown(null);
  };

  const handleSwap = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  // Simple date change handler
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setTravelDate(selectedDate);
    
    // Update selected tab if the date matches one of the tabs
    const tabIndex = dateTabs.findIndex(tab => tab.date === selectedDate);
    if (tabIndex !== -1) {
      setSelectedDateTab(tabIndex);
    } else {
      setSelectedDateTab(-1); // Custom date selected
    }
  };

  const handleDateTabClick = (index) => {
    setSelectedDateTab(index);
    setTravelDate(dateTabs[index].date);
  };

  const getSelectedDate = () => {
    return travelDate || dateTabs[selectedDateTab]?.date;
  };

  const handleSearch = async () => {
    const selectedDate = getSelectedDate();
    
    if (!fromLocation?.id || !toLocation?.id || !selectedDate) {
      alert("Please select From, To and Date");
      return;
    }

    if (!tokenId) {
      alert("Authentication failed. Please try again.");
      return;
    }

    console.log("Searching buses:", { fromLocation, toLocation, selectedDate, selectedSeatType, showACOnly });
    
    try {
      const result = await dispatch(fetchSearch({
        OriginId: fromLocation.id,
        DestinationId: toLocation.id,
        DateOfJourney: selectedDate,
        EndUserIp: "192.168.1.1", 
        TokenId: tokenId,
      }));
      
      if (fetchSearch.fulfilled.match(result)) {
        navigate('/buseResults1');
      } else {
        console.log("Search Failed", result.payload || result.error);
        alert("No buses found or API failed.");
      }
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  // Format date for display
  const formatSelectedDate = () => {
    if (!travelDate) return "Calendar";
    const date = new Date(travelDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        {status === "loading" && <p>Loading cities...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col gap-6">
          {/* Top Section - Input Fields and Options */}
          <div className="flex flex-col lg:flex-row items-end gap-2">
            {/* From and To Fields */}
            <div className="flex w-full justify-center gap-4 items-end">
              {/* From Field */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  From
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={activeDropdown === "from" ? fromInput : fromLocation?.name || ""}
                    onChange={(e) => {
                      setFromInput(e.target.value);
                      debouncedFromSearch(e.target.value);
                    }}
                    onFocus={() => setActiveDropdown("from")}
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    placeholder="Type city..."
                  />
                  {fromLocation?.name && (
                    <button
                      onClick={() => setFromLocation({ id: null, name: "" })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                  {activeDropdown === "from" && (
                    <ul className="absolute w-full bg-white text-gray-600 border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                      {filteredFromCities.length > 0 ? (
                        filteredFromCities.slice(0, 10).map((c) => (
                          <li
                            key={c.CityId}
                            onClick={() => handleSelectCity(c, "from")}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {c.CityName}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No cities found</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSwap}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                >
                  <FaExchangeAlt className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* To Field */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  To
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={activeDropdown === "to" ? toInput : toLocation?.name || ""}
                    onChange={(e) => {
                      setToInput(e.target.value);
                      debouncedToSearch(e.target.value);
                    }}
                    onFocus={() => setActiveDropdown("to")}
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                    placeholder="Type city..."
                  />
                  {toLocation?.name && (
                    <button
                      onClick={() => setToLocation({ id: null, name: "" })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                  {activeDropdown === "to" && (
                    <ul className="absolute w-full bg-white text-gray-600 border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10 shadow-lg">
                      {filteredToCities.length > 0 ? (
                        filteredToCities.slice(0, 10).map((c) => (
                          <li
                            key={c.CityId}
                            onClick={() => handleSelectCity(c, "to")}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          >
                            {c.CityName}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No cities found</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Date Tabs */}
            <div className="flex lg:w-1/2 w-full items-end justify-between gap-2">
              {dateTabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleDateTabClick(index)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedDateTab === index
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              
              {/* SIMPLE SOLUTION: Visible Date Input styled like a button */}
              <div className="relative">
                <label className="sr-only">Select Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={handleDateChange}
                    className="w-full h-full px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-300 hover:bg-gray-50 cursor-pointer appearance-none"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      backgroundSize: '16px 16px',
                      paddingRight: '2.5rem'
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - bustype Selection and Search Button */}
          <div className="flex flex-col lg:flex-row w-full justify-between space-y-4">
            {/* Seat Type Options */}
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium text-gray-600 mb-2">
                Seat type (optional)
              </label>
              <div className="flex w-full gap-2">
                {["Seater", "Sleeper", "Semi-Sleeper"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedSeatType(selectedSeatType === type ? "" : type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedSeatType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* AC Buses Checkbox */}
            <div className="flex w-full items-center">
              <input
                type="checkbox"
                id="acOnly"
                checked={showACOnly}
                onChange={(e) => setShowACOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acOnly" className="ml-2 text-sm font-medium text-gray-600">
                Show AC Buses only
              </label>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={status === "searchloading"}
              className={`w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600 transition ${
                status === "searchloading" ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {status === "searchloading" ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Loading buses...
                </div>
              ) : (
                "Search Buses"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearchPage;