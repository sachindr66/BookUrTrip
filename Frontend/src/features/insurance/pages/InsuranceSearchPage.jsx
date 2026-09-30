import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"
import { authenticateInsurance, insuranceSearch } from '../insuranceSlice';


const PLAN_CATEGORY_OPTIONS = [
  { value: 1, label: "Domestic Travel Policy" },
  { value: 2, label: "Overseas Travel Insurance" },
];

const PLAN_COVERAGE_OPTIONS = [
  { value: 1, label: "US" },
  { value: 2, label: "Non-US" },
  { value: 3, label: "WorldWide" },
  { value: 4, label: "India" },
  { value: 5, label: "Asia" },
  { value: 6, label: "Canada" },
  { value: 7, label: "Australia" },
  { value: 8, label: "Schengen Countries" },
];

const InsuranceSearchPage = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { tokenId, error, status  } = useSelector((state) => state.insurance)

  // Form state
  const [activeTab, setActiveTab] = useState("single")
  const [planCategory, setplanCategory] = useState(1)
  const [planCoverage, setPlanCoverage] = useState(4)

  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [duration, setDuration] = useState(1);

  const [travelers, setTravelers] = useState(1);

  const [travelerAges, setTravelerAges] = useState([25]);



  // Authenticate when page loads
  useEffect(() => {
    dispatch(authenticateInsurance())
  }, [dispatch])


  // Date formatter
  const formatApiDate = (date) => {
    if (!date) return "";

    const selectedDate = new Date(date);

    return `${selectedDate.getFullYear()}/${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}/${String(selectedDate.getDate()).padStart(
      2,
      "0"
    )}`;
  };



  // Calculate duration
  const handleDepartDateChange = (e) => {
    const date = e.target.value
    setDepartDate(date)
    if (returnDate && date) {
      const start = new Date(date)
      const end = new Date(returnDate)

      const difference = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24) + 1
      )
      if (difference > 0) {
        setDuration(difference)
      }
    }
  }

  const handleReturnDateChange = (e) => {
    const date = e.target.value;

    setReturnDate(date);

    if (departDate && date) {
      const start = new Date(departDate);
      const end = new Date(date);

      const difference =
        Math.ceil(
          (end - start) / (1000 * 60 * 60 * 24)
        ) + 1;

      if (difference > 0) {
        setDuration(difference);
      }
    }
  };

  // Handle traveler count
  const handleTravelerChange = (e) => {
    const count = Number(e.target.value);

    setTravelers(count);

    setTravelerAges((previousAges) => {
      if (count > previousAges.length) {
        return [
          ...previousAges,
          ...Array(count - previousAges.length).fill(22),
        ];
      }

      return previousAges.slice(0, count);
    });
  };

  // Handle traveler age
  const handleAgeChange = (index, value) => {
    const updatedAges = [...travelerAges];

    updatedAges[index] = Number(value);

    setTravelerAges(updatedAges);
  };


  //Search
  const handleSearch = async () => {

    //token validation
    if (!tokenId) {
      alert("Authentication token not available. Please try again.");
      return;
    }
    //Basic validation
    if (!departDate) {
      alert("Please select departure date")
      return;
    }

    if (activeTab === "single" && !returnDate) {
      alert("Please select return date")
      return;
    }

    // Create API request

    const searchData = {

      PlanCategory: planCategory,
      PlanType: activeTab === "single" ? 1 : 2,
      PlanCoverage: planCoverage,
      TravelStartDate: formatApiDate(departDate),
      TravelEndDate: activeTab === "single"
        ? formatApiDate(returnDate)
        : formatApiDate(
          new Date(
            new Date(departDate).setDate(
              new Date(departDate).getDate() + duration - 1
            )
          )
        ),
      NoOfPax: travelers,
      PaxAge: travelerAges,
      TokenId:tokenId
    }
    console.log("🚀 Insurance Search Request:", searchData);

    try {
      const result = await dispatch(
        insuranceSearch(searchData)
      ).unwrap()
      console.log("✅ Insurance Search Response:", result);

      // Save only search parameters
const savedSearchData = {
  ...searchData,
  TokenId: undefined,
};

sessionStorage.setItem(
  "insuranceSearchData",
  JSON.stringify(savedSearchData)
);

      // Navigate to result page
      navigate("/insurance-List")
      
    } catch (error) {
      console.error("❌ Insurance Search Error:", error);
       // ❌ Backend says error
       alert(
    error|| "Insurance search failed."
      );
      return
    }


  }
  
    // Loading
  const isSearching = status === "searchloading";


  return (
    <div>
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab("single")}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === "single"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-500"
            }`}
        >
          Single Trip
        </button>

        <button
          onClick={() => setActiveTab("annual")}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${activeTab === "annual"
            ? "bg-white text-blue-600 shadow"
            : "text-gray-500"
            }`}
        >
          Annual Trip
        </button>
      </div>

      {activeTab === "single" && (

        <div className='flex  flex-wrap gap-2'>

          {/* plan category */}

          <div className='flex flex-col items-start'>
            <label htmlFor="" className="block text-sm font-medium text-gray-600 mb-2">Plan Ctegory</label>
            <select name=""
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
               text-sm text-gray-700 shadow-sm outline-none
               transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200"'
              value={planCategory} onChange={(e) => setplanCategory(Number(e.target.value))} id="">
              {PLAN_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col items-start'>
            <label htmlFor="" className="block text-sm font-medium text-gray-600 mb-2">Plan Coverage</label>
            <select name=""
              className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
               text-sm text-gray-700 shadow-sm outline-none
               transition
               focus:border-blue-500 focus:ring-2 focus:ring-blue-200"'
              value={planCoverage} onChange={(e) => setPlanCoverage(Number(e.target.value))}>
              {PLAN_COVERAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col items-start'>
            <label className=' block text-sm font-medium text-gray-600 mb-2'>DepartDate</label>
            <input type="date"
              value={departDate}
              onChange={handleDepartDateChange}
              className='w-full text-gray-600 px-4 py-2 border border-gray-300 rounded-lg'
              // min={new Date().toISOString().split("T")[0]}
              name="" id="" />
          </div>

          {/* Return Date */}

          <div className='flex flex-col items-start'>
            <label className=' block text-sm font-medium text-gray-600 mb-2'>ReturntDate</label>
            <input type="date"
              value={returnDate}
              onChange={handleReturnDateChange}
              className='w-full text-gray-600 px-4 py-2 border border-gray-300 rounded-lg'
              min={departDate || new Date().toISOString().split("T")[0]}
              name="" id="" />
          </div>

          {/* Duration */}

          <div className='flex flex-col items-start'>
            <label className=' block text-sm font-medium text-gray-600 mb-2'>Trip Duration</label>
            <input type="text"
              value={duration}
              placeholder='Days'
              readOnly
              className='w-full text-gray-600 px-4 py-2 border border-gray-300 rounded-lg'
            />
          </div>

          {/* Travelers */}
          <div className='flex flex-col items-start'>
            <label className=' block text-sm font-medium text-gray-600 mb-2'>Travelers</label>
            <select
              value={travelers}
              onChange={handleTravelerChange}
              className="w-full text-gray-600 px-1 py-2 border border-gray-300 rounded-lg"
            >
              {Array.from(
                { length: 9 },
                (_, index) => index + 1
              ).map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
          </div>

          {/* Ages */}
          <div>
            <label className=' block text-sm font-medium text-gray-600 mb-2'>Traveler Age</label>
            {travelerAges.map((age, index) => (
              <input
                key={index}
                type='number'
                min="0.5"
                max="70"
                step={0.5}
                value={age}
                onChange={(e) => handleAgeChange(index, e.target.value)}
                placeholder={`Traveler ${index + 1}`}
                className="w-28 px-6 py-2 border text-gray-600 border-gray-300 rounded-lg"
              />
            ))}


          </div>




        </div>

      )}

      {activeTab === "annual" && (
        <div className='flex justify-between flex-wrap w-full gap-3'>

          <button className='w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-600'>Search</button>
        </div>
      )}

      {/* Search */}
      <button type='button'
        onClick={handleSearch}
        disabled={isSearching || !tokenId}
        className='btn-primary cursor-pointer'
      >
        {isSearching
          ? "Searching..."
          : "Search Insurance Plans"}
      </button>

      {/* Error */}

      {error && (
        <p className="text-red-500 text-center mt-4">
          {error}
        </p>
      )}

    </div>

  )
}

export default InsuranceSearchPage
