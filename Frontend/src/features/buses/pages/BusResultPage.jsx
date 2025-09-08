// Empty file - BusResultPage.jsx
import React from 'react'
import { useSelector } from 'react-redux'

const BusResultPage = () => {

  const {searchResults=[], status,error,}=useSelector((state)=>state.buses)



  return (
    <div>
      <h1>welcome</h1>
      <div>
        {searchResults.map((bus,index)=>{
          return(
            <div key={index}>
              <div>
              <li>{bus.BusType}</li>
              <li>{bus.BusPrice.BasePrice}</li>
              <li>{bus.ArrivalTime}</li>
              <li>{bus.DepartureTime}</li>
              </div>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default BusResultPage
