import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StatsGrid from './components/StatsGrid';
import PassengersTable from './components/RoutesTable';
import PassengerDetailsModal from './components/RouteDetailsModal';
import UserStatusService from '../../services/operations/userStatusService';

function RoutingDashboard() {
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [stats, setStats] = useState({
    totalPassengers: 0,
    pendingRouting: 0,
    averageWaitTime: '0 min',
    routingEfficiency: '0%'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await UserStatusService.getUsersByStatus('routing', token);
        const users = response.users;
        
        // Transform the user data to match the table format
        const formattedPassengers = users.map(user => ({
          id: user.id,
          name: user.name,
          phone: user.mobile,
          status: user.status,
          pickupLocation: user.homeAddress?.address || 'Not specified',
          dropLocation: user.workAddress?.address || 'Not specified',
          officeTiming: {
            inTime: user.profile?.officeTimings?.inTime || 'Not specified',
            outTime: user.profile?.officeTimings?.outTime || 'Not specified'
          },
          sharing: user.profile?.sharing || 'Not specified',
          oneSideRoute: user.profile?.oneSideRoute || 'Not specified',
          workingDays: user.profile?.workingDays || 'Not specified'

        }));

        setPassengers(formattedPassengers);
        
        // Update stats based on fetched data
        setStats({
          totalPassengers: users.length,
          pendingRouting: users.filter(user => user.status === 'pending').length,
          averageWaitTime: '10 min', // This should be calculated based on your business logic
          routingEfficiency: '85%' // This should be calculated based on your business logic
        });
        
        setError(null);
      } catch (err) {
        setError(`Error fetching data: ${err.message}`);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const renderStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'assigned': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 overflow-y-auto h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Passenger Routing</h1>
        <p className="text-gray-600">Manage and assign routes to waiting passengers</p>
      </div>

      <StatsGrid stats={stats} />
      <PassengersTable 
        passengers={passengers}
        onPassengerSelect={setSelectedPassenger}
        renderStatusBadge={renderStatusBadge}
      />
      <PassengerDetailsModal 
        passenger={selectedPassenger}
        onClose={() => setSelectedPassenger(null)}
        renderStatusBadge={renderStatusBadge}
      />
    </div>
  );
}

export default RoutingDashboard;