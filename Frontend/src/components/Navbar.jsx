import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Buses', path: '/buses', icon: '🚌' },
    { name: 'Hotels', path: '/hotels', icon: '🏨' },
    { name: 'Flights', path: '/flights', icon: '✈️' },
    { name: 'Transfer', path: '/TransferHome', icon: '🚗' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '?';
    const names = user.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
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
            <div className="hidden md:flex space-x-6">
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

            {/* Desktop Auth Section */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>My Profile</span>
                        </Link>
                        
                        <Link
                          to="/bookings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>My Bookings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="flex items-center space-x-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>{loading ? 'Logging out...' : 'Sign Out'}</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
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
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
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
            
            {/* Mobile User Info */}
            {isAuthenticated && user && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {getUserInitials()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
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
                
                {isAuthenticated && user && (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActiveRoute('/profile')
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                          : "text-neutral-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={handleDrawerToggle}
                    >
                      <span className="text-xl">👤</span>
                      <span className="font-medium">Profile</span>
                    </Link>
                  </>
                )}
                
                <div className="pt-4 border-t border-gray-100 mt-4">
                  {isAuthenticated && user ? (
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="font-medium">{loading ? 'Logging out...' : 'Sign Out'}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={handleDrawerToggle}
                        className="block w-full text-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={handleDrawerToggle}
                        className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
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
