import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HotelsPage = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    roomType: 'Any'
  });

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
    { 
      name: 'Mumbai', 
      image: '🏙️', 
      hotels: 250, 
      avgPrice: '₹3,500',
      rating: 4.5,
      description: 'City of Dreams'
    },
    { 
      name: 'Delhi', 
      image: '🏛️', 
      hotels: 300, 
      avgPrice: '₹4,200',
      rating: 4.3,
      description: 'Heart of India'
    },
    { 
      name: 'Bangalore', 
      image: '🌆', 
      hotels: 180, 
      avgPrice: '₹3,800',
      rating: 4.4,
      description: 'Garden City'
    },
    { 
      name: 'Chennai', 
      image: '🏖️', 
      hotels: 150, 
      avgPrice: '₹3,200',
      rating: 4.2,
      description: 'Gateway to South'
    },
    { 
      name: 'Hyderabad', 
      image: '🏰', 
      hotels: 120, 
      avgPrice: '₹3,600',
      rating: 4.1,
      description: 'City of Pearls'
    },
    { 
      name: 'Kolkata', 
      image: '🎭', 
      hotels: 200, 
      avgPrice: '₹3,400',
      rating: 4.0,
      description: 'City of Joy'
    }
  ];

  const features = [
    {
      icon: '🏨',
      title: 'Wide Selection',
      description: 'Choose from 10,000+ hotels worldwide'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Guaranteed lowest rates and exclusive deals'
    },
    {
      icon: '⭐',
      title: 'Verified Reviews',
      description: 'Real guest experiences and ratings'
    },
    {
      icon: '🔒',
      title: 'Secure Booking',
      description: 'Safe and encrypted payment process'
    }
  ];

  const hotelTypes = [
    {
      name: 'Luxury Hotels',
      icon: '🌟',
      description: '5-star accommodations with premium amenities',
      features: ['Spa & Wellness', 'Fine Dining', 'Concierge Service', 'Premium Rooms']
    },
    {
      name: 'Business Hotels',
      icon: '💼',
      description: 'Perfect for corporate travelers',
      features: ['Business Center', 'Meeting Rooms', 'High-Speed WiFi', '24/7 Service']
    },
    {
      name: 'Budget Hotels',
      icon: '💰',
      description: 'Affordable comfort for smart travelers',
      features: ['Clean Rooms', 'Essential Amenities', 'Great Location', 'Value for Money']
    }
  ];

  const amenities = [
    { icon: '🏊‍♂️', name: 'Swimming Pool' },
    { icon: '🏋️‍♂️', name: 'Fitness Center' },
    { icon: '🍽️', name: 'Restaurant' },
    { icon: '🚗', name: 'Free Parking' },
    { icon: '📶', name: 'Free WiFi' },
    { icon: '🧳', name: 'Luggage Storage' },
    { icon: '🛎️', name: 'Room Service' },
    { icon: '🚿', name: 'Hot Shower' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing hotels, resorts, and accommodations worldwide. Book with confidence and enjoy your stay.
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={searchData.destination}
                    onChange={handleInputChange}
                    placeholder="Where are you going?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={searchData.checkIn}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={searchData.checkOut}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <select
                    name="guests"
                    value={searchData.guests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rooms
                  </label>
                  <select
                    name="rooms"
                    value={searchData.rooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    name="roomType"
                    value={searchData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="Any">Any Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                🏨 Search Hotels
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Hotel Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-2">
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
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{destination.image}</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{destination.avgPrice}</div>
                      <div className="text-sm text-gray-500">per night</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-3">{destination.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>🏨 {destination.hotels} hotels</span>
                    <span className="flex items-center">
                      ⭐ {destination.rating}
                    </span>
                  </div>
                  <Link 
                    to="/hotels/search" 
                    className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    View Hotels
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Types */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Choose Your Hotel Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotelTypes.map((type, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-teal-100 rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{type.name}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
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

      {/* Amenities Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Popular Amenities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-3xl mb-3">{amenity.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{amenity.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Stay?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Find the perfect hotel for your next adventure
          </p>
          <div className="space-x-4">
            <Link
              to="/hotels/search"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
            >
              🏨 Search Hotels
            </Link>
            <Link
              to="/bookings"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-200"
            >
              📋 My Bookings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelsPage;
