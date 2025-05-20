import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Users, Route, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import PassengerMap from './PassengerMap';

function PassengersTable({ passengers, onPassengerSelect, renderStatusBadge }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log('Passengers data:', passengers);
  }, [passengers]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span>Passenger</span>
                    {isExpanded ? (
                      <ChevronUp className="ml-2 h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Working Days</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Sharing</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Route className="h-4 w-4 mr-2 text-green-500" />
                    <span>Route Type</span>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Timings</span>
                  </div>
                </th>
              </tr>
            </thead>
            {isExpanded && (
              <tbody className="bg-white divide-y divide-gray-200">
                {passengers?.map((passenger) => (
                  <tr 
                    key={passenger.id}
                    className="hover:bg-gray-50"
                    onClick={() => onPassengerSelect?.(passenger)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                       
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
                          <div className="text-sm text-gray-500">{passenger.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(passenger.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-2">
                        <div className="group relative flex items-center bg-gray-50 p-2 rounded-lg">
                          <MapPin className="mr-2 text-blue-500" />
                          <span className="truncate max-w-[200px]">
                            {passenger.homeAddress?.address?.length > 20 
                              ? `${passenger.homeAddress.address.substring(0, 20)}...`
                              : passenger.homeAddress?.address || 'Not specified'}
                          </span>
                          <div className="absolute left-0 top-full mt-1 w-auto p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <div className="flex items-center">
                              <MapPin className="mr-2 text-blue-400" />
                              <span>{passenger.homeAddress?.address || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="group relative flex items-center bg-gray-50 p-2 rounded-lg">
                          <MapPin className="mr-2 text-green-500" />
                          <span className="truncate max-w-[200px]">
                            {passenger.workAddress?.address?.length > 20 
                              ? `${passenger.workAddress.address.substring(0, 20)}...`
                              : passenger.workAddress?.address || 'Not specified'}
                          </span>
                          <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                            <div className="flex items-center">
                              <MapPin className="mr-2 text-green-400" />
                              <span>{passenger.workAddress?.address || 'Not specified'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {passenger.workingDays?.join(', ') || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {passenger.sharing || 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {passenger.oneSideRoute}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {passenger.officeTiming?.inTime && passenger.officeTiming?.outTime
                        ? `${passenger.officeTiming.inTime} - ${passenger.officeTiming.outTime}`
                        : 'Not specified'}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Passenger Locations Map</h2>
        <PassengerMap passengers={passengers} />
      </div>
    </div>
  );
}

export default PassengersTable; 