import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { busSeatLayout } from '../busesSlice'
import { useLocation } from 'react-router-dom'

const BusSeatLayoutPage = () => {

  const dispatch = useDispatch()
  const location = useLocation()
  const {tokenId, status,error, searchResults=[],SeatLayoutResults=[]}=useSelector((state)=>state.buses)

  const selectedBus = location.state?.selectedBus
  const traceId = location.state?.traceId

  console.log("seat layout results" , SeatLayoutResults)

  useEffect(()=>{

      
      const seatLayoutParams = {
        EndUserIp: "192.168.1.1",
        ResultIndex:selectedBus.ResultIndex, // Use the actual ResultIndex from the bus
        TraceId: traceId, // Use the TraceId from Redux state
        TokenId: tokenId,
      };



    dispatch(busSeatLayout(seatLayoutParams))
  },[tokenId,traceId,dispatch])


  return (

    <div>

      <h1>welcome</h1>
 

 {SeatLayoutResults && (
        <div>
          <h3>Available Seats: {SeatLayoutResults.AvailableSeats}</h3>
          {}
         {SeatLayoutResults.SeatLayout &&(
          
         
               <div>
              <h4>Seat Layout (Visual):</h4>
              <div dangerouslySetInnerHTML={{ __html: SeatLayoutResults.HTMLLayout }} />
            </div>

         )}
         {SeatLayoutResults.SeatLayout &&(
          <div>
            <pre>{JSON.stringify(SeatLayoutResults.SeatLayout,null,2)}</pre>
            </div>
         )}
        </div>

      )}



     
      </div>
  )
}

export default BusSeatLayoutPage

