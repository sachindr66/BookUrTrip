import React from 'react';
import { Link } from 'react-router-dom';
import BusSerachPage from './BusSerachPage';
import busImage from '../images/bus1.png';

const BusHomePage = () => {
  const popularRoutes = [
    { from: 'Bangalore', to: 'Mysore', price: '₹250', duration: '3h 30m' },
    { from: 'Mumbai', to: 'Pune', price: '₹180', duration: '2h 45m' },
    { from: 'Delhi', to: 'Agra', price: '₹320', duration: '4h 15m' },
    { from: 'Chennai', to: 'Bangalore', price: '₹450', duration: '6h 20m' },
    { from: 'Hyderabad', to: 'Bangalore', price: '₹380', duration: '5h 45m' },
    { from: 'Kolkata', to: 'Bhubaneswar', price: '₹280', duration: '4h 30m' }
  ];

  const features = [
    {
      icon: '🚌',
      title: 'Wide Network',
      description: 'Connect to 1000+ cities across India'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Guaranteed lowest fares and great deals'
    },
    {
      icon: '🕒',
      title: '24/7 Support',
      description: 'Round the clock customer assistance'
    },
    {
      icon: '🎫',
      title: 'Easy Booking',
      description: 'Simple and secure booking process'
    }
  ];

  const busTypes = [
    {
      name: 'AC Sleeper',
      icon: '🛏️',
      description: 'Comfortable AC sleeper buses for long journeys',
      features: ['AC', 'Reclining Seats', 'Clean Bedding', 'WiFi']
    },
    {
      name: 'Non-AC Seater',
      icon: '💺',
      description: 'Economical non-AC buses for short trips',
      features: ['Comfortable Seats', 'Affordable', 'Regular Stops', 'Ventilation']
    },
    {
      name: 'Luxury Bus',
      icon: '⭐',
      description: 'Premium luxury buses with premium amenities',
      features: ['Premium Seats', 'Entertainment', 'Refreshments', 'Priority Service']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${busImage})` }}
        >
          {/* Overlay with gradient */}
          <div className="absolute inset-0" style={{
            background: 'rgba(0,0,0,0.6)',
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Start Your Trip with{' '}
              <span className="underline decoration-2 underline-offset-8">
                Book Ur Trip
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Take a little break from the work stress of everyday. Discover plan trip and explore beautiful destinations.
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
            <BusSerachPage />
            
            {/* Info Row */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 mt-6">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Free cancellation and get a full refund</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-6 text-white text-xs font-bold flex items-center justify-center rounded" style={{
                  background: '#0052D4',
                  background: '-webkit-linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)',
                  background: 'linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)'
                }}>
                  IRCTC
                </div>
                <span>Authorized Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Bus Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Popular Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-semibold text-gray-800">
                    {route.from} → {route.to}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#0052D4' }}>{route.price}</div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>⏱️ {route.duration}</span>
                  <Link 
                    to="/buses/search" 
                    className="font-medium hover:underline transition-all duration-200"
                    style={{ color: '#4364F7' }}
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bus Types */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Choose Your Bus Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {busTypes.map((type, index) => (
              <div key={index} className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100" style={{
                background: 'linear-gradient(135deg, rgba(111, 177, 252, 0.1) 0%, rgba(67, 100, 247, 0.1) 50%, rgba(0, 82, 212, 0.1) 100%)'
              }}>
                <div className="text-5xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{type.name}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="text-sm text-gray-700 bg-white bg-opacity-80 rounded-full px-3 py-1 inline-block mx-1 border border-gray-200">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{
        background: '#0052D4',
        background: '-webkit-linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)',
        background: 'linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)'
      }}>
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Book your bus tickets now and enjoy comfortable travel across India
          </p>
          <div className="space-x-4">
            <Link
              to="/buses/search"
              className="inline-block bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              style={{ color: '#0052D4' }}
            >
              🚌 Search Buses
            </Link>
            <Link
              to="/bookings"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white transition-all duration-200"
              style={{ '--tw-text-opacity': '1', color: 'rgba(255, 255, 255, var(--tw-text-opacity))' }}
              onMouseEnter={(e) => e.target.style.color = '#0052D4'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              📋 My Bookings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusHomePage;
