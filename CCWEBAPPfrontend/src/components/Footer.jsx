import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiLinkedin, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-12 relative overflow-hidden">
      {/* Enhanced Wave Pattern */}
      <div className="absolute top-0 left-0 w-full opacity-15 h-32">
        <svg viewBox="0 0 1440 320" className="w-full h-full">
          <path fill="currentColor" fillOpacity="0.2" d="M0,224L48,218.7C96,213,192,203,288,181.3C384,160,480,128,576,133.3C672,139,768,181,864,202.7C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Subscribe Section */}
          <div className="lg:col-span-2 space-y-6 relative">
            <div className="group">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  SUBSCRIBE
                </span>{' '}
                TO OUR
                <br />
                <span className="inline-block mt-2 transform transition-transform hover:scale-105">
                  SERVICES NOW!
                </span>
              </h2>
              <p className="text-lg md:text-xl mt-4 opacity-90 leading-relaxed">
                Join <span className="text-cyan-400 font-medium">2100+ satisfied customers</span> who solved their
                commute problems with us.
              </p>
            </div>
            
            {/* Subscription Form */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
              <Link to="/signup" className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:opacity-90 transition-opacity shadow-lg hover:shadow-cyan-500/20">
                Pre Register Now →
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 md:mt-0 ml-3 md:ml-0">
            <h3 className="text-cyan-400 text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-lg hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                  Home
                </Link>
              </li>
              {['About', 'Service'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-lg hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {[
              { icon: FiMail, title: 'MAIL US', content: 'dixsincabs@corporatecruise.in' },
              { icon: FiPhone, title: 'CALL US', content: '+91 7525902299' },
              { icon: FiMapPin, title: 'VISIT US', content: 'Migsun Ultimo , Pocket A, Omicron III, Greater Noida, Mathurapur, Uttar Pradesh 201310 ' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-cyan-400 transition-colors">
                  <item.icon className="w-6 h-6 text-cyan-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-cyan-400 text-lg font-medium mb-1">{item.title}</h3>
                  <p className="text-base opacity-90 leading-snug">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6">
            <p className="text-center md:text-left text-sm opacity-80">
              © 2025 DIXSIN CABS PVT LTD. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-cyan-400 text-sm">CONNECT WITH US:</span>
              <div className="flex gap-4">
                {[
                  { icon: FiFacebook, link: ' https://www.facebook.com/profile.php?id=61571774335510' },
                  { icon: FiInstagram, link: 'https://www.instagram.com/corporatecruise/' },
                  { icon: FiLinkedin, link: ' https://www.linkedin.com/company/corporatecruise/' },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className="p-2 rounded-full bg-gray-900 hover:bg-cyan-400 transition-colors text-white hover:text-gray-900"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;