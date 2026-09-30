
import React from 'react';
import { Link } from 'react-router-dom';
import InsuranceSearchPage from './InsuranceSearchPage';
// import insuranceImage from '../images/bus1.png';

const InsuranceHomePage = () => {
  const popularPlans = [
    {
      name: 'Health Insurance',
      price: '₹499/month',
      coverage: 'Up to ₹10 Lakh',
      description: 'Comprehensive health coverage for you and your family',
    },
    {
      name: 'Life Insurance',
      price: '₹699/month',
      coverage: 'Up to ₹1 Crore',
      description: 'Secure your family future with reliable life protection',
    },
    {
      name: 'Vehicle Insurance',
      price: '₹2,499/year',
      coverage: 'Comprehensive',
      description: 'Complete protection for your car and two-wheeler',
    },
    {
      name: 'Travel Insurance',
      price: '₹299/trip',
      coverage: 'Up to ₹50 Lakh',
      description: 'Travel worry-free with complete trip protection',
    },
    {
      name: 'Personal Accident',
      price: '₹199/month',
      coverage: 'Up to ₹25 Lakh',
      description: 'Financial protection against accidental injuries',
    },
    {
      name: 'Home Insurance',
      price: '₹999/year',
      coverage: 'Up to ₹50 Lakh',
      description: 'Protect your home and valuable belongings',
    },
  ];

  const features = [
    {
      icon: '🛡️',
      title: 'Complete Protection',
      description: 'Comprehensive insurance plans designed for your needs',
    },
    {
      icon: '💰',
      title: 'Affordable Premiums',
      description: 'Get reliable coverage at competitive prices',
    },
    {
      icon: '⚡',
      title: 'Quick Processing',
      description: 'Fast policy purchase and hassle-free claim process',
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Our support team is available whenever you need help',
    },
  ];

  const insuranceTypes = [
    {
      name: 'Health Insurance',
      icon: '❤️',
      description:
        'Protect yourself and your family from unexpected medical expenses.',
      features: [
        'Hospitalization Cover',
        'Cashless Treatment',
        'Family Coverage',
        'Pre & Post Hospitalization',
      ],
    },
    {
      name: 'Life Insurance',
      icon: '👨‍👩‍👧',
      description:
        'Secure your loved ones financially and build a protected future.',
      features: [
        'Life Cover',
        'Financial Security',
        'Tax Benefits',
        'Flexible Plans',
      ],
    },
    {
      name: 'Vehicle Insurance',
      icon: '🚗',
      description:
        'Protect your vehicle against accidents, theft and unexpected damages.',
      features: [
        'Accident Cover',
        'Theft Protection',
        'Third Party Cover',
        'Cashless Repairs',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            // backgroundImage: `url(${insuranceImage})`,
            backgroundImage: `blue`,
          }}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(rgba(0, 0, 0, 0.70), rgba(0, 38, 100, 0.65))',
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white">
              Protect What Matters{' '}
              <span className="underline decoration-2 underline-offset-8">
                Most
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Secure your health, family, vehicle and future with trusted
              insurance plans designed for you.
            </p>
          </div>

          {/* Search / Quote Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
            <InsuranceSearchPage />

            {/* Info Row */}
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 mt-6">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <svg
                  className="w-5 h-5"
                  style={{ color: '#0052D4' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-.55-.038-1.09-.11-1.616z"
                  />
                </svg>

                <span>Trusted insurance plans with secure processing</span>
              </div>

              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-6 text-white text-xs font-bold flex items-center justify-center rounded"
                  style={{
                    background:
                      'linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)',
                  }}
                >
                  ✓
                </div>

                <span>Secure & Trusted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Our Insurance?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>

                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Insurance Plans */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Popular Insurance Plans
          </h2>

          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the right insurance plan to protect yourself, your family
            and your valuable assets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPlans.map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h3>

                  <span
                    className="text-lg font-bold"
                    style={{ color: '#0052D4' }}
                  >
                    {plan.price}
                  </span>
                </div>

                <div
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                  style={{
                    backgroundColor: 'rgba(67, 100, 247, 0.1)',
                    color: '#4364F7',
                  }}
                >
                  {plan.coverage}
                </div>

                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                <Link
                  to="/insurance/search"
                  className="font-medium hover:underline transition-all duration-200"
                  style={{ color: '#4364F7' }}
                >
                  View Plan →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Choose Your Insurance Type
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insuranceTypes.map((type, index) => (
              <div
                key={index}
                className="rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(111, 177, 252, 0.1) 0%, rgba(67, 100, 247, 0.1) 50%, rgba(0, 82, 212, 0.1) 100%)',
                }}
              >
                <div className="text-5xl mb-4">{type.icon}</div>

                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {type.name}
                </h3>

                <p className="text-gray-600 mb-6">
                  {type.description}
                </p>

                <div className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="text-sm text-gray-700 bg-white bg-opacity-80 rounded-full px-3 py-1 inline-block mx-1 border border-gray-200"
                    >
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
      <section
        className="py-20 px-4"
        style={{
          background:
            'linear-gradient(to right, #6FB1FC, #4364F7, #0052D4)',
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Future?
          </h2>

          <p className="text-xl text-blue-100 mb-8">
            Compare insurance plans and choose the protection that fits your
            needs.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/insurance/search"
              className="inline-block bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              style={{ color: '#0052D4' }}
            >
              🛡️ Explore Insurance
            </Link>

            <Link
              to="/insurance/policies"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white transition-all duration-200"
              style={{ color: 'white' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0052D4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              📋 My Policies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsuranceHomePage;
