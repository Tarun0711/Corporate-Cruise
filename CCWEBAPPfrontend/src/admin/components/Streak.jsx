import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from 'lucide-react';

function Streak({ attendanceData = {}, title = "Attendance Streak", isExpanded, onToggle }) {
  useEffect(() => {
    // console.log('Streak Component - Received attendance data:', attendanceData);
  }, [attendanceData]);

  // Get current month's details
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create array of days for the current month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Calculate number of rows needed (assuming 7 days per row)
  const rows = Math.ceil(daysInMonth / 7);

  // Create grid array with empty slots for proper alignment
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const gridArray = Array(rows * 7).fill(null);
  
  // Fill the grid array with actual days
  days.forEach((day, index) => {
    gridArray[firstDayOfMonth + index] = day;
  });

  // Calculate streak statistics
  const totalDays = Object.values(attendanceData).filter(Boolean).length;
  const streakPercentage = Math.round((totalDays / daysInMonth) * 100);

  // console.log('Streak Component - Calculated stats:', {
  //   totalDays,
  //   streakPercentage,
  //   daysInMonth,
  //   firstDayOfMonth
  // });

  return (
    <div className="bg-gray-50 w-full rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            {streakPercentage}% attendance
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="text-gray-400" size={20} />
        ) : (
          <ChevronDown className="text-gray-400" size={20} />
        )}
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 pt-0">
          {/* Month and Year */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h3>
          </div>
          

          {/* Calendar grid */}
          <div className="grid grid-cols-12 gap-2">
            {gridArray.map((day, index) => {
              const hasAttendance = day && attendanceData[day];
              const isToday = day === currentDay;
              // console.log(`Day ${day}: Has attendance = ${hasAttendance}`);
              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-full flex items-center justify-center text-sm
                    transition-colors duration-200
                    ${!day ? 'invisible' : ''}
                    ${isToday 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : hasAttendance 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : day 
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                          : ''
                    }
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Days Present</p>
                <p className="font-medium text-gray-700">{totalDays} days</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly Progress</p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${streakPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Streak.propTypes = {
  attendanceData: PropTypes.object,
  title: PropTypes.string,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default Streak;