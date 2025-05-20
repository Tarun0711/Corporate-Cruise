import React from 'react';
import { FiMapPin, FiClock, FiCalendar, FiEdit2, FiPackage, FiCreditCard, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiDroplet, FiUsers, FiDollarSign } from 'react-icons/fi';

const DashboardCards = ({ userData }) => {
  // Calculate data for UI display
  const carbonSaved = ((userData?.totalRides || 0) * 3.2).toFixed(1);  // kg of CO2
  const fuelSaved = ((userData?.totalRides || 0) * 0.9).toFixed(1);    // liters
  const moneySaved = ((userData?.totalRides || 0) * 120).toFixed(0);   // rupees
  
  // Calculate commute consistency
  const onTimePercentage = 92; // Would come from backend based on arrival time data
  const preferredRidemates = ["Ankita S.", "Rohan M.", "Varun D."]; // Based on ratings and frequency
  
  // Calculate upcoming ride date
  const today = new Date();
  const nextRideDate = new Date(today);
  nextRideDate.setDate(today.getDate() + 1);
  const nextRideFormatted = nextRideDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Route Summary Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiMapPin className="text-primary mr-2" /> Your Route
            </h2>
            <button className="text-primary hover:text-secondary text-sm flex items-center">
              <FiEdit2 className="mr-1" /> Edit
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <FiMapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">From</p>
                <p className="text-sm font-medium text-gray-700">{userData?.homeAddress?.address || 'Not set'}</p>
              </div>
            </div>
            
            <div className="border-l-2 border-dashed border-gray-300 h-4 ml-4"></div>
            
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <FiMapPin className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">To</p>
                <p className="text-sm font-medium text-gray-700">{userData?.workAddress?.address || 'Not set'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <FiClock className="mr-1.5" /> {userData?.timing || 'Not set'}
            </div>
            <div className="flex items-center text-gray-600">
              <FiCalendar className="mr-1.5" /> {userData?.weekSchedule?.length || 0} days/week
            </div>
          </div>
        </div>
      </div>

      {/* Package Details Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiPackage className="text-blue-600 mr-2" /> Package Details
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              userData?.package?.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {userData?.package?.status || 'Pending'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">{userData?.package?.name || 'Not selected'}</p>
              <p className="text-xs text-gray-500">Validity: {userData?.package?.validity || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">{userData?.package?.price || 'N/A'}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>
          
          {/* Progress bar for validity could go here */}
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
            <button className="flex-1 btn-primary text-sm py-2">
              Renew
            </button>
            <button className="flex-1 btn-secondary text-sm py-2">
              Change Package
            </button>
          </div>
        </div>
      </div>

      {/* Payment Status Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiCreditCard className="text-green-600 mr-2" /> Payment Status
            </h2>
          </div>
          
          <div className="text-center mb-4">
            {userData?.payment?.status === 'Paid' ? (
              <div className="inline-flex items-center justify-center bg-green-100 rounded-full p-3 mb-2">
                <FiCheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="inline-flex items-center justify-center bg-yellow-100 rounded-full p-3 mb-2">
                <FiAlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            )}
            <p className={`text-lg font-semibold ${
              userData?.payment?.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {userData?.payment?.status || 'Pending'}
            </p>
            <p className="text-xs text-gray-500">
              Next due: {userData?.payment?.nextDue || 'Not applicable'}
            </p>
          </div>
          
          {/* Payment progress/days remaining */}
          {userData?.payment?.nextDue && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">21 days remaining</p>
            </div>
          )}
          
          <button className={`w-full mt-2 text-sm py-2 rounded-lg transition-colors ${
            userData?.payment?.status === 'Paid' 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'btn-primary'
          }`}>
            {userData?.payment?.status === 'Paid' ? 'View History' : 'Make Payment'}
          </button>
        </div>
      </div>

      {/* Commute Efficiency Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiTrendingUp className="text-primary mr-2" /> Commute Stats
            </h2>
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
              <FiClock className="mr-1" /> On Time: {onTimePercentage}%
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <FiMapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Average commute time</p>
                <p className="text-sm font-medium text-gray-700">{userData?.averageCommuteTime || '45 minutes'} each way</p>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-3">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiUsers className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Preferred ridemates</p>
                  <p className="text-sm font-medium text-gray-700">
                    {preferredRidemates.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-3">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiCalendar className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next scheduled ride</p>
                  <p className="text-sm font-medium text-gray-700">{nextRideFormatted}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button className="w-full text-primary text-sm border border-primary rounded-lg py-1.5 hover:bg-primary hover:text-white transition-colors">
              View Detailed Stats
            </button>
          </div>
        </div>
      </div>

      {/* Impact Dashboard Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiDroplet className="text-green-600 mr-2" /> Sustainability Impact
            </h2>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
              Top 10% saver
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-green-600">{carbonSaved}</p>
              <p className="text-xs text-gray-600">kg CO₂ saved</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-600">{fuelSaved}</p>
              <p className="text-xs text-gray-600">L fuel saved</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-purple-600">₹{moneySaved}</p>
              <p className="text-xs text-gray-600">money saved</p>
            </div>
          </div>
          
          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sustainability Goals</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Carbon reduction</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Team participation</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button className="w-full text-primary text-sm border border-primary rounded-lg py-1.5 hover:bg-primary hover:text-white transition-colors">
              View Impact Report
            </button>
          </div>
        </div>
      </div>

      {/* Financial Benefits Card */}
      <div 
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiDollarSign className="text-yellow-600 mr-2" /> Financial Benefits
            </h2>
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Quarterly
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Monthly Savings</p>
                  <p className="text-xl font-bold text-gray-800">₹3,600</p>
                </div>
                <div className="bg-white p-2 rounded-full">
                  <FiTrendingUp className="text-green-500 h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">vs. driving alone daily</p>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Savings Breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Fuel costs avoided</span>
                  <span className="font-medium">₹2,100/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Parking fees saved</span>
                  <span className="font-medium">₹800/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Vehicle maintenance</span>
                  <span className="font-medium">₹700/mo</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700">Corporate discount</p>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">15% monthly subscription discount applied</p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button className="w-full text-primary text-sm border border-primary rounded-lg py-1.5 hover:bg-primary hover:text-white transition-colors">
              View Financial Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;
