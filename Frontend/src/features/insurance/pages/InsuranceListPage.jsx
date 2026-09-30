import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { authenticateInsurance, insuranceSearch } from '../insuranceSlice'

const InsuranceListPage = () => {

  const dispatch = useDispatch()


  const { tokenId, searchResults, status, error, } = useSelector((state) => state.insurance)

  // Get saved search data only once
  const [searchData] = useState(() => {
    const savedData = sessionStorage.getItem("insuranceSearchData")

    if (!savedData) {
      return null
    }

    try {
      return JSON.parse(savedData)

    } catch (error) {
      console.error(
        "Invalid saved search data:",
        error
      )
      return null
    }
  })


  // Prevent duplicate API request
  const searchCalled = useRef(false);

  console.log("Search Data:", searchData);
  console.log("Token ID:", tokenId);
  console.log("Insurance Results:", searchResults);


  // STEP 1: Authenticate

  useEffect(() => {
    if (searchData && !tokenId && !searchResults?.data?.Response?.Result?.length) {
      console.log(" Authenticating insurance...")
      dispatch(authenticateInsurance())
    }
  }, [dispatch, tokenId, searchData, searchResults])

  // STEP 2: Search after token

  useEffect(() => {
    if (tokenId && searchData && !searchResults?.data?.Response?.Result?.length && !searchCalled.current) {
      searchCalled.current = true

      const requestData = {
        ...searchData,
        TokenId: tokenId,
      }
      console.log("🔄 Searching insurance again:", requestData)
      dispatch(
        insuranceSearch(requestData)
      );
    }
  }, [tokenId, searchData, searchResults, dispatch])

  //Plans

  const plans = searchResults?.data?.Response?.Results || []
  console.log(plans)

  //loading

  if (
    status === "authloading" || status === "searchloading"
  ) {
    return (
      <div className="p-6">
        <h2>Loading insurance plans...</h2>
      </div>
    )
  }


  //Error

  if (error) {
    return (
      <div>
        <h2 className="text-red-500">
          Insurance Error
        </h2>
        <p className="text-red-500 mt-2">
          {error}
        </p>

      </div>
    )
  }

   // No search data

   if(!searchData){
    return(
    <div className='p-6'>
      <h2>
        No insurance search data found.
      </h2>
      <p className='text-gray-600'>
        Please go back and search again.
      </p>
    </div>
    )
   }





  return (
    <div>
      <h1>search LIST</h1>
      <div>
        <p>PlanCategory</p>
        {searchData.PlanCategory}
        <p>PlanCategory</p>
        {searchData.PlanCoverage}
        <p>PlanType</p>
        {searchData.PlanType}
        <p>TravelStartDate</p>
        {searchData.TravelStartDate}
        <p>TravelEndDate</p>
        {searchData.TravelEndDate}
        <p>
          Travelers:{" "}
          {searchData.NoOfPax}
        </p>
      </div>

      <div>
        {plans.length > 0 ?(
          <div>
             <h2 className="text-xl font-semibold mb-4">
            Available Insurance Plans
          </h2>

          {plans.map((planss, index)=>(
            <div key={index}>
              <h3>{planss.PlanName}</h3>
              <h2>{planss.PlanCategory}</h2>
            </div>

          ))}

          </div>
        ):(
          <p>No insurance result found</p>
        )}
      </div>
    </div>
  )
}

export default InsuranceListPage
