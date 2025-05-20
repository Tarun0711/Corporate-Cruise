import React from 'react';
import { Users, Clock, TrendingUp, MapPin } from 'lucide-react';

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-blue-100">
            <Users className="text-blue-600" size={24} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{stats.totalPassengers}</p>
            <p className="text-sm text-gray-500">Total Passengers</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-green-100">
            <MapPin className="text-green-600" size={24} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{stats.pendingRouting}</p>
            <p className="text-sm text-gray-500">Pending Routing</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-yellow-100">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{stats.averageWaitTime}</p>
            <p className="text-sm text-gray-500">Avg. Wait Time</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-purple-100">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{stats.routingEfficiency}</p>
            <p className="text-sm text-gray-500">Routing Efficiency</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsGrid; 