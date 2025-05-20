import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import logo from '../assets/logo/c.svg'; // Make sure to add your logo to assets folder
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <Link to="/" className="flex items-center">
              <img
                className="h-14 w-auto sm:h-16 md:h-20"
                src={logo}
                alt="Corporate Cruise Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex space-x-12">
              {['Home', 'About', 'Service'].map((item, index) => (
                <Link
                  key={index}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="group text-gray-700 text-lg font-medium relative px-3 py-2 transition-colors duration-300 hover:text-primary"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-4">
            {/* Pre-register Button - Always visible */}
            <Link
              to="/signup"
              className="bg-primary md:block hidden text-white px-6 py-2.5 rounded-lg text-base font-medium 
                       hover:bg-primary/90 transition-all duration-300 transform hover:scale-105
                       hover:shadow-lg active:scale-95"
            >
              Pre Register
            </Link>

            {/* Login Button - Always visible */}
            <Link
              to="/signin"
              className="bg-gray-100 text-gray-700 p-2 md:px-6 md:py-2.5 rounded-lg   text-base font-medium 
                       hover:bg-gray-200 transition-all duration-300 mr-4"
            >
              <span className='md:block hidden'>
              Login

              </span>
              <span className='md:hidden text-[#1791c8]'>
              <LogIn/>
              </span>
              
            </Link>

            {/* Mobile menu button */}
            <div className="md:hidden mobile-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600
                         hover:text-primary hover:bg-primary/10 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <HiX className="block h-6 w-6 font-bold text-[#1791c8] transition-transform duration-300" />
                ) : (
                  <HiMenu className="block h-6 w-6 font-bold text-[#1791c8] transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: -20 }
        }}
        transition={{ duration: 0.2 }}
        className={`fixed left-0 right-0 top-20 md:hidden bg-white/95 backdrop-blur-md shadow-lg
                   ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
      >
        <div className="max-w-7xl flex flex-col items-center justify-center mx-auto px-4 py-4 space-y-3">
          {['Home', 'About', 'Service'].map((item, index) => (
            <Link
              key={index}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="block px-4 py-3 text-lg font-medium text-gray-700 rounded-lg
                       hover:bg-primary/10 hover:text-primary transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
            
          ))}
          <Link
            to="/signup"
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-base font-medium 
                     hover:bg-primary/90 transition-all duration-300 transform hover:scale-105
                     hover:shadow-lg active:scale-95"
          >
            Pre Register
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}

export default Navigation;
