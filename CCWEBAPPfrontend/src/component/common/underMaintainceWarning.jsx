import React, { useState } from 'react';

function UnderMaintenanceWarning() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="z-50 w-full relative flex justify-center bg-yellow-50 border-b border-yellow-200 shadow-sm">
      <div className=" py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 font-medium text-yellow-800">
              <span className="md:hidden">We're crafting something awesome 🚧</span>
              <span className="hidden md:inline">We're currently building something amazing for you. Hang tight, we'll be live soon! 🚀</span>
            </p>
          </div>
          
        </div>
      </div>
      <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-500 absolute right-4 top-1/2 transform -translate-y-1/2 hover:text-yellow-700 focus:outline-none"
            aria-label="Close warning"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
    </div>
  );
}

export default UnderMaintenanceWarning;
