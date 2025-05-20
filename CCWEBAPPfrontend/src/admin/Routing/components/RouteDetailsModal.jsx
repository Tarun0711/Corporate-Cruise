import React, { useState } from 'react';
import { AlertCircle, MapPin, Clock, User } from 'lucide-react';

function PassengerDetailsModal({ passenger, onClose, renderStatusBadge }) {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [availableRoutes, setAvailableRoutes] = useState([
    { id: 1, name: 'Downtown Express', time: '08:00 AM', seats: 3 },
    { id: 2, name: 'University Shuttle', time: '09:00 AM', seats: 2 },
    { id: 3, name: 'Business District', time: '07:30 AM', seats: 4 }
  ]);

  if (!passenger) return null;

  const handleAssignRoute = () => {
    if (selectedRoute) {
      // Handle route assignment
      console.log(`Assigning route ${selectedRoute.name} to passenger ${passenger.name}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Passenger Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <AlertCircle size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1">{renderStatusBadge(passenger.status)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Contact</h3>
            <p className="mt-1">{passenger.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Pickup Location</h3>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <p>{passenger.pickupLocation}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Drop Location</h3>
            <div className="flex items-center mt-1">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <p>{passenger.dropLocation}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Office Timing</h3>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <p>{passenger.officeTiming.inTime} - {passenger.officeTiming.outTime}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Available Routes</h3>
          <div className="space-y-3">
            {availableRoutes.map((route) => (
              <div
                key={route.id}
                className={`p-4 rounded-lg border ${
                  selectedRoute?.id === route.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                } cursor-pointer`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{route.name}</h4>
                    <p className="text-sm text-gray-500">Departure: {route.time}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Available Seats: {route.seats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignRoute}
            disabled={!selectedRoute}
            className={`px-4 py-2 rounded-lg ${
              selectedRoute
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Assign Route
          </button>
        </div>
      </div>
    </div>
  );
}

export default PassengerDetailsModal; 