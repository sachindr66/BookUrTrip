import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { busBoardingPoint, busSeatLayout } from '../busesSlice'
import { useLocation, useNavigate } from 'react-router-dom'

const BusSeatLayoutPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { tokenId, status, error, SeatLayoutResults ,BoardingPointsDetails=[]} = useSelector((s) => s.buses)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedSeatData, setSelectedSeatData] = useState([]) // Store complete seat data

  const navigate = useNavigate()

  const selectedBus = location.state?.selectedBus
  const traceId = location.state?.traceId

  console.log("BoardingPointsDetails", BoardingPointsDetails)

  const goToBoardingPoints = () => {
    navigate("/busBoardingPoint",{
      state: {
        selectedBus: selectedBus,
        traceId: traceId,
        tokenId: tokenId,
        selectedSeats: selectedSeats,
        selectedSeatData: selectedSeatData
      }
    },[navigate, selectedBus, traceId, tokenId])  
  }

  // Helper to get seat identifier
  const getSeatIdentifier = (seat) =>
    seat.SeatName || seat.seatName || seat.SeatNumber || seat.seatNumber

  // Fetch seat layout on mount or dependency change
  useEffect(() => {
    if (!selectedBus || !traceId || !tokenId) return

    const seatLayoutParams = {
      EndUserIp: '192.168.1.1',
      ResultIndex: selectedBus.ResultIndex,
      TraceId: traceId,
      TokenId: tokenId,
    }

    dispatch(busSeatLayout(seatLayoutParams))
    dispatch(busBoardingPoint(seatLayoutParams))
  }, [dispatch, selectedBus, traceId, tokenId])



  // Handle seat click
  const handleSeatClick = useCallback((seatIdentifier, seatData) => {
    setSelectedSeats((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(seatIdentifier)
      
      if (isCurrentlySelected) {
        // Remove seat from selection
        setSelectedSeatData(prev => prev.filter(seat => seat.SeatName !== seatIdentifier))
        return prevSelected.filter((seat) => seat !== seatIdentifier)
      } else {
        // Add seat to selection
        setSelectedSeatData(prev => [...prev, seatData])
        return [...prevSelected, seatIdentifier]
      }
    })
  }, [])

  // Determine seat status
  const getSeatStatus = useCallback(
    (seat) => {
      const seatName = getSeatIdentifier(seat)
      if (selectedSeats.includes(seatName)) return 'selected'
      if (seat.SeatStatus === true || seat.IsAvailable === true) return 'available'
      return 'occupied'
    },
    [selectedSeats]
  )

  // Determine CSS class based on seat status
  const getSeatClass = useCallback((seat) => {
    const status = getSeatStatus(seat)
    const baseClass =
      'w-12 h-12 m-1 rounded-lg border-2 flex items-center justify-center text-sm font-medium cursor-pointer transition-all duration-200'

    switch (status) {
      case 'selected':
        return `${baseClass} bg-primary-500 text-white border-primary-600 hover:bg-primary-600`
      case 'available':
        return `${baseClass} bg-white text-gray-700 border-gray-300 hover:bg-primary-50 hover:border-primary-400`
      case 'occupied':
        return `${baseClass} bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed`
      default:
        return baseClass
    }
  }, [getSeatStatus])

  // Normalize seat layout data into rows
  const normalizeSeatLayout = (rawLayout) => {
    if (!rawLayout) return []

    let rows = []

    if (Array.isArray(rawLayout)) {
      if (rawLayout.length && Array.isArray(rawLayout[0])) {
        rows = rawLayout
      } else {
        rows = [rawLayout]
      }
    } else if (rawLayout.SeatDetails && Array.isArray(rawLayout.SeatDetails)) {
      rows = rawLayout.SeatDetails
    } else if (rawLayout.SeatLayout && Array.isArray(rawLayout.SeatLayout)) {
      rows = rawLayout.SeatLayout
    } else {
      const values = Object.values(rawLayout).flat?.() ?? []
      if (Array.isArray(values) && values.length) {
        const grouped = values.reduce((acc, s) => {
          const r = s?.RowNo ?? '0'
          if (!acc[r]) acc[r] = []
          acc[r].push(s)
          return acc
        }, {})
        rows = Object.values(grouped)
      }
    }
    return rows
  }

  // Render seat layout
  const renderSeatLayout = (rawLayout) => {
    if (!rawLayout || rawLayout.length === 0) {
      return <div className="text-center text-gray-600">No seat layout available</div>
    }

    const rows = normalizeSeatLayout(rawLayout)

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Select Your Seats</h3>
          <p className="text-gray-600">
            Available Seats:{' '}
            <span className="font-semibold text-primary-600">
              {SeatLayoutResults.AvailableSeats ?? '—'}
            </span>
          </p>
        </div>

        {/* Bus Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Driver Area */}
          <div className="text-center mb-4">
            <div className="inline-block bg-gray-200 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-600">🚌 Driver</span>
            </div>
          </div>

          {/* Seats Grid */}
          <div className="space-y-3">
            {rows.map((rowArr = [], rIdx) => {
              const seats = (rowArr || [])
                .slice()
                .sort(
                  (a, b) =>
                    parseInt(a?.ColumnNo || '0', 10) - parseInt(b?.ColumnNo || '0', 10)
                )
              return (
                <div key={rIdx} className="flex items-center justify-center space-x-4">
                  {/* Row Label */}
                  <div className="w-12 text-sm font-medium text-gray-600 text-center">
                    Row {rIdx + 1}
                  </div>
                  {/* Seats in Row */}
                  <div className="flex space-x-2">
                    {seats.map((seat, index) => {
                      const seatName = getSeatIdentifier(seat)
                      const available = seat.SeatStatus === true
                      const isSelected = selectedSeats.includes(seatName)
                      const seatPrice =
                        seat?.Price?.PublishedPriceRoundedOff ??
                        seat?.SeatFare ??
                        'N/A'
                      const berthType = seat.IsUpper ? 'Upper' : 'Lower' // Your key property

                      return (
                        <div key={seat.SeatIndex ?? seatName} className="relative">
                          <div
                            className={getSeatClass(seat)}
                            onClick={() => available && handleSeatClick(seatName, seat)}
                            title={`Seat ${seatName} - ${berthType} - ${
                              available ? 'Available' : 'Booked'
                            } - ₹${seatPrice}`}
                          >
                            {seatName}
                            {/* Show berth type */}
                            <div className="text-xs text-gray-500">{berthType}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center space-x-6">
            {/* Available */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            {/* Selected */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-500 border-2 border-primary-600 rounded"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            {/* Occupied */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
          </div>
        </div>

        {/* Selected Seats Summary & Proceed Button */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h4 className="font-semibold text-primary-800 mb-2">Selected Seats:</h4>
            
            {/* Detailed Seat Information */}
            <div className="mb-4">
              {selectedSeatData.map((seat, index) => (
                <div key={seat.SeatIndex} className="flex items-center justify-between bg-white rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {seat.SeatName}
                    </span>
                    <div className="text-sm text-gray-600">
                      <div>Seat ID: {seat.SeatIndex}</div>
                      <div>Type: {seat.IsUpper ? 'Upper' : 'Lower'}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    ₹{seat.SeatFare || seat.Price?.PublishedPriceRoundedOff || 'N/A'}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 mb-3">
              Total: {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} - ₹
              {selectedSeatData.reduce((total, seat) => total + (seat.SeatFare || 0), 0)}
            </div>
            
            <button
              className="btn-primary"
              disabled={selectedSeats.length === 0}
              onClick={goToBoardingPoints}
            >
              Proceed to Boarding Points
            </button>

          </div>
        )}
        
      </div>
    )
  }

  // Determine source for layout
  const layoutSource =
    SeatLayoutResults?.SeatLayout ??
    SeatLayoutResults?.SeatDetails ??
    SeatLayoutResults

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {error ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Seats</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : status === 'loading' ? (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading seat layout...</p>
          </div>
        ) : SeatLayoutResults ? (
          renderSeatLayout(layoutSource)
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Seat Data</h3>
            <p className="text-gray-600">No seat layout data available.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusSeatLayoutPage