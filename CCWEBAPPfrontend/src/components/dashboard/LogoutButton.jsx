import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ handleLogout }) => {
  return (
    <div className="fixed bottom-5 right-6">
      <button
        onClick={handleLogout}
        className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
      >
        <span className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start text-white group-hover:px-3">
          <LogOut />
        </span>
        <span className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          Logout
        </span>
      </button>
    </div>
  );
};

export default LogoutButton; 