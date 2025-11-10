import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { featchAirports } from '../flightsSlice';




const FlightsPage = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way'
  });

  const disptach = useDispatch()


  const { airports } = useSelector((state) => state.flights);

  console.log("front end airports", airports)

  useEffect(() => {
    disptach(featchAirports());
  }, [disptach]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Search data:', searchData);
  };

  const popularDestinations = [
    { from: 'Delhi', to: 'Mumbai', price: '₹4,500', duration: '2h 15m', airline: 'Air India' },
    { from: 'Bangalore', to: 'Delhi', price: '₹6,200', duration: '2h 45m', airline: 'IndiGo' },
    { from: 'Mumbai', to: 'Bangalore', price: '₹3,800', duration: '1h 55m', airline: 'Vistara' },
    { from: 'Chennai', to: 'Kolkata', price: '₹5,100', duration: '2h 30m', airline: 'SpiceJet' },
    { from: 'Hyderabad', to: 'Delhi', price: '₹5,800', duration: '2h 20m', airline: 'GoAir' },
    { from: 'Kolkata', to: 'Mumbai', price: '₹4,900', duration: '2h 40m', airline: 'AirAsia' }
  ];

  const features = [
    {
      icon: '✈️',
      title: 'Wide Network',
      description: 'Connect to 500+ destinations worldwide'
    },
    {
      icon: '💰',
      title: 'Best Deals',
      description: 'Lowest airfares guaranteed'
    },
    {
      icon: '🕒',
      title: '24/7 Support',
      description: 'Round the clock assistance'
    },
    {
      icon: '🎫',
      title: 'Instant Booking',
      description: 'Book and confirm in minutes'
    }
  ];

  const cabinClasses = [
    {
      name: 'Economy',
      icon: '💺',
      description: 'Affordable travel with essential amenities',
      features: ['Standard Seat', 'Meal Option', 'Baggage Allowance', 'Entertainment']
    },
    {
      name: 'Premium Economy',
      icon: '🪑',
      description: 'Enhanced comfort with extra legroom',
      features: ['Extra Legroom', 'Priority Boarding', 'Enhanced Meal', 'Lounge Access']
    },
    {
      name: 'Business Class',
      icon: '⭐',
      description: 'Premium luxury with exclusive services',
      features: ['Lie-Flat Seats', 'Gourmet Dining', 'Lounge Access', 'Priority Service']
    }
  ];

  const airlines = [
    { name: 'Air India', logo: '🇮🇳', rating: 4.2 },
    { name: 'IndiGo', logo: '🛩️', rating: 4.5 },
    { name: 'Vistara', logo: '✈️', rating: 4.3 },
    { name: 'SpiceJet', logo: '🌶️', rating: 4.1 },
    { name: 'GoAir', logo: '🚀', rating: 4.0 },
    { name: 'AirAsia', logo: '🌏', rating: 4.4 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Book Your Flight
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the world with our extensive flight network. Find the best deals on domestic and international flights.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip Type Selection */}
              <div className="flex justify-center space-x-4 mb-6">
                {['One Way', 'Round Trip', 'Multi City'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSearchData(prev => ({ ...prev, tripType: type }))}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${searchData.tripType === type
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="text"
                    name="from"
                    value={searchData.from}
                    onChange={handleInputChange}
                    placeholder="Departure City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <input
                    type="text"
                    name="to"
                    value={searchData.to}
                    onChange={handleInputChange}
                    placeholder="Destination City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={searchData.departureDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Return Date (for Round Trip) */}
                {searchData.tripType === 'Round Trip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={searchData.returnDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                )}

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <select
                    name="passengers"
                    value={searchData.passengers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>

                {/* Cabin Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cabin Class
                  </label>
                  <select
                    name="cabinClass"
                    value={searchData.cabinClass}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                ✈️ Search Flights
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Flight Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((route, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {route.from} → {route.to}
                    </div>
                    <div className="text-sm text-gray-500">{route.airline}</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{route.price}</div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>⏱️ {route.duration}</span>
                  <Link
                    to="/flights/search"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cabin Classes */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Choose Your Cabin Class
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cabinClasses.map((cabin, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-4">{cabin.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{cabin.name}</h3>
                <p className="text-gray-600 mb-6">{cabin.description}</p>
                <div className="space-y-2">
                  {cabin.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-sm text-gray-700 bg-white bg-opacity-50 rounded-full px-3 py-1 inline-block mx-1">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Airlines Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Trusted Airlines
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {airlines.map((airline, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-4xl mb-3">{airline.logo}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{airline.name}</h3>
                <div className="flex items-center justify-center">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span className="text-sm text-gray-600">{airline.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Flight?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your flights now and explore destinations around the world
          </p>
          <div className="space-x-4">
            <Link
              to="/flights/search"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              ✈️ Search Flights
            </Link>
            <Link
              to="/bookings"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              📋 My Bookings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FlightsPage;
