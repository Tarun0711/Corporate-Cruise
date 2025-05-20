import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    Car, 
    MapPin, 
    Clock, 
    User, 
    DollarSign, 
    ChevronRight,
    X,
    CheckCircle2,
    AlertCircle,
    Ban,
    Trash2,
    Plus
} from 'lucide-react';

function Rides() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRide, setSelectedRide] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(null);

    // Sample data - replace with actual API data
    const rides = [
        {
            id: 'R001',
            driver: 'John Doe',
            passengers: [
                { name: 'Sarah Smith', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
                { name: 'Mike Johnson', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
                { name: 'Emily Davis', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
                { name: 'Sarah Smith', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
                { name: 'Mike Johnson', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
                { name: 'Emily Davis', image: 'https://randomuser.me/api/portraits/women/2.jpg' }
            ],
            pickup: '123 Main St',
            dropoff: '456 Market St',
            status: 'Completed',
            fare: '$25.00',
            date: '2024-03-15',
            time: '09:30 AM',
            rating: 4.5
        },
        // Add more sample rides...
    ];

    const filteredRides = rides.filter(ride => {
        const matchesSearch = 
            ride.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ride.passengers.some(passenger => passenger.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = filterStatus === 'all' || ride.status.toLowerCase() === filterStatus.toLowerCase();
        
        return matchesSearch && matchesStatus;
    });

    const handleRowClick = (ride) => {
        setSelectedRide(ride);
        setIsSidebarOpen(true);
    };

    const handleAction = (action, ride) => {
        // Handle different actions (cancel, complete, etc.)
        // console.log(action, ride);
        setMenuOpen(null);
    };

    return (
        <div className="p-6 bg-gray-100 overflow-y-hidden w-full h-full">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Rides</h1>
                <p className="text-gray-600">Manage and monitor all rides</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <Car className="text-blue-600" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">42</p>
                            <p className="text-sm text-gray-500">Active Rides</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-green-100">
                            <CheckCircle2 className="text-green-600" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">128</p>
                            <p className="text-sm text-gray-500">Completed Today</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <AlertCircle className="text-yellow-600" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">5</p>
                            <p className="text-sm text-gray-500">Pending Rides</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-purple-100">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">$3,245</p>
                            <p className="text-sm text-gray-500">Today's Revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID, driver, passenger..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-400" size={20} />
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Rides Table */}
            <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
                <div className="overflow-x-auto h-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ride ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRides.map((ride) => (
                                <tr 
                                    key={ride.id} 
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(ride)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ride.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-primary font-bold">
                                                    {ride.driver.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{ride.driver}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex -space-x-2">
                                            {ride.passengers.slice(0, 3).map((passenger, index) => (
                                                <div key={index} className="relative">
                                                    {passenger.image ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full border-2 border-white"
                                                            src={passenger.image}
                                                            alt={passenger.name}
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center">
                                                            <span className="text-primary font-bold">
                                                                {passenger.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {ride.passengers.length > 3 && (
                                                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-600 font-bold">
                                                        +{ride.passengers.length - 3}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <MapPin className="text-gray-400 mr-2" size={16} />
                                            <div className="text-sm text-gray-900">
                                                {ride.pickup} → {ride.dropoff}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            ride.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            ride.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                            ride.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {ride.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ride.fare}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(menuOpen === ride.id ? null : ride.id);
                                                }}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            {menuOpen === ride.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                                                    <div className="py-1">
                                                        {ride.status === 'Active' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAction('complete', ride);
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                <CheckCircle2 className="mr-2" size={16} />
                                                                Mark as Completed
                                                            </button>
                                                        )}
                                                        {ride.status === 'Pending' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAction('cancel', ride);
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                            >
                                                                <Ban className="mr-2" size={16} />
                                                                Cancel Ride
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAction('delete', ride);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            <Trash2 className="mr-2" size={16} />
                                                            Delete Record
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ride Details Sidebar */}
            {isSidebarOpen && selectedRide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div 
                        className="absolute right-0 h-screen w-[600px] bg-white shadow-xl transform transition-all overflow-y-auto duration-300 ease-in-out"
                        style={{
                            animation: 'slideIn 0.3s ease-out'
                        }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Sidebar Header */}
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800">Ride Details</h2>
                                <button 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-4">
                                {/* Ride Status */}
                                <div className="mb-6">
                                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                        selectedRide.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        selectedRide.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                        selectedRide.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedRide.status}
                                    </span>
                                </div>

                                {/* Route Information */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">Route Information</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="text-gray-400" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-700">Pickup Location</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedRide.pickup}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <MapPin className="text-gray-400" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-700">Dropoff Location</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedRide.dropoff}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Passengers Section */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">Passengers</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {selectedRide.passengers.map((passenger, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                {passenger.image ? (
                                                    <img
                                                        className="h-16 w-16 rounded-full border-2 border-white mb-2"
                                                        src={passenger.image}
                                                        alt={passenger.name}
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center mb-2">
                                                        <span className="text-primary font-bold text-lg">
                                                            {passenger.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-gray-900 text-center">
                                                    {passenger.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ride Details */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h4 className="text-sm font-medium text-gray-500 mb-3">Ride Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="text-gray-400" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-700">Date & Time</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedRide.date} at {selectedRide.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="text-gray-400" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-700">Fare</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedRide.fare}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <User className="text-gray-400" size={18} />
                                            <div>
                                                <p className="text-sm text-gray-700">Rating</p>
                                                <p className="text-sm font-medium text-gray-900">{selectedRide.rating}/5.0</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                @media screen and (max-width: 768px) {
                    .absolute {
                        width: 100% !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default Rides;