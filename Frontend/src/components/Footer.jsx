import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Support', path: '/support' },
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Flight Booking', path: '/flights' },
        { name: 'Hotel Booking', path: '/hotels' },
        { name: 'Bus Booking', path: '/buses' },
        { name: 'My Bookings', path: '/bookings' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cancellation Policy', path: '/cancellation' },
      ]
    },
    {
      title: 'Contact Info',
      links: [
        { name: 'support@bookurtrip.com', path: 'mailto:support@bookurtrip.com' },
        { name: '+1 (555) 123-4567', path: 'tel:+15551234567' },
        { name: '123 Travel Street, City, State 12345', path: '#' },
      ]
    }
  ];

  const socialLinks = [
    { icon: '📘', url: 'https://facebook.com', label: 'Facebook' },
    { icon: '🐦', url: 'https://twitter.com', label: 'Twitter' },
    { icon: '📷', url: 'https://instagram.com', label: 'Instagram' },
    { icon: '💼', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: '📺', url: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">
                BookUrTrip
              </h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                Your trusted partner for all travel needs. Book flights, hotels, and buses with ease and confidence.
              </p>
              
              {/* Service Icons */}
              <div className="flex space-x-4 mb-4">
                <span className="text-2xl">✈️</span>
                <span className="text-2xl">🏨</span>
                <span className="text-2xl">🚌</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      href={link.path.startsWith('http') || link.path.startsWith('mailto:') || link.path.startsWith('tel:') ? link.path : undefined}
                      target={link.path.startsWith('http') ? '_blank' : undefined}
                      rel={link.path.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BookUrTrip. All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center md:justify-end space-x-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 bg-gray-800 text-gray-400 hover:text-blue-400 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:border-blue-400"
              >
                <span className="text-lg">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg text-center">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">
            Stay Updated
          </h4>
          <p className="text-gray-300 mb-3 text-sm">
            Subscribe to our newsletter for travel tips, deals, and updates.
          </p>
          <p className="text-gray-500 text-xs">
            Newsletter subscription feature coming soon...
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
