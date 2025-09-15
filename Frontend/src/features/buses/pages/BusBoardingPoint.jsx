import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { busBoardingPoint } from '../busesSlice'
import { useLocation, useNavigate } from 'react-router-dom'

const BusBoardingPoint = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate= useNavigate()

  const formdetails=()=>{
    navigate('/busFormDetailsPage')
  }

  const selectedBus = location.state?.selectedBus;
  const traceId = location.state?.traceId;

  const { BoardingPointsDetails = [], DropingPointsDetails=[], tokenId, status, error } = useSelector((state) => state.buses);

  useEffect(() => {
    if (!selectedBus || !traceId || !tokenId || status === 'loading') return;
    const BoardingParams = {
      EndUserIp: '192.168.1.1',
      ResultIndex: selectedBus.ResultIndex,
      TraceId: traceId,
      TokenId: tokenId,
    };
    dispatch(busBoardingPoint(BoardingParams));
  }, [dispatch, tokenId, selectedBus, traceId, status]);

  console.log('Boarding pages',BoardingPointsDetails);
  console.log('Boarding pages',DropingPointsDetails);

  if (status === 'loading') return <p>Loading boarding points...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Bus Boarding Points</h1>
      {BoardingPointsDetails.length === 0 ? (
        <p>No boarding points available.</p>
      ) : (
        <ul>
          {BoardingPointsDetails.map((point) => (
            <li key={point.CityPointIndex}>
              <strong>{point.CityPointLocation}</strong> - {point.CityPointLandmark} <br />
              Address: {point.CityPointAddress} <br />
              Contact: {point.CityPointContactNumber}
            </li>
          ))}
        </ul>
      )}


           {DropingPointsDetails.length === 0 ? (
        <p>No droping points available.</p>
      ) : (
        <ul>
          {DropingPointsDetails.map((point) => (
            <li key={point.CityPointIndex}>
              <strong>{point.CityPointLocation}</strong> - {point.CityPointLandmark} <br />
              Address: {point.CityPointAddress} <br />
              Contact: {point.CityPointContactNumber}
            </li>
          ))}
        </ul>
      )}

      <button onClick={formdetails} className='btn-primary'>Next</button>
    </div>
  );
};

export default BusBoardingPoint;