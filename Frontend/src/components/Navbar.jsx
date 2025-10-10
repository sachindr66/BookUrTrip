import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { name: 'Flights', path: '/flights', icon: '✈️' },
    { name: 'Hotels', path: '/hotels', icon: '🏨' },
    { name: 'Buses', path: '/buses', icon: '🚌' },
    { name: 'Bookings', path: '/bookings', icon: '📋' },
    { name: 'Profile', path: '/profile', icon: '👤' },
    { name: 'Transfer', path: '/TransferHome', icon: '👤' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <header className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-50">
        <nav className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
              BookUrTrip
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? "text-blue-600 bg-blue-50 border-b-2 border-blue-500" 
                        : "text-neutral-700 hover:text-blue-600 hover:bg-blue-50"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </div>

            {/* Desktop Login Button */}
            <div className="hidden md:block">
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>🔐</span>
                <span>Login</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              onClick={handleDrawerToggle}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button
                onClick={handleDrawerToggle}
                className="p-2 rounded-lg text-neutral-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActiveRoute(item.path)
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                        : "text-neutral-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                    onClick={handleDrawerToggle}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4">
                  <Link
                    to="/login"
                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    onClick={handleDrawerToggle}
                  >
                    🔐 Login
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
