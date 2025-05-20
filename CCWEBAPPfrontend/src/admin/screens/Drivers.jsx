import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  User, 
  Car, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Ban, 
  Edit2, 
  Trash2,
  DollarSign,
  Navigation,
  FileText
} from 'lucide-react';

// Mock data for drivers
const mockDrivers = [
  {
    id: 'DRV001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    city: 'New York',
    address: '123 Main St, New York, NY 10001',
    status: 'Active',
    rating: 4.8,
    vehicle: {
      model: 'Toyota Camry 2022',
      plate: 'NY-ABC123',
      type: 'Sedan'
    },
    totalRides: 245,
    earnings: 12500,
    completionRate: 98,
    documents: [
      { name: 'Driver License', status: 'Verified' },
      { name: 'Vehicle Registration', status: 'Verified' },
      { name: 'Insurance Certificate', status: 'Verified' },
      { name: 'Background Check', status: 'Verified' }
    ]
  },
  {
    id: 'DRV002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 234-5678',
    city: 'Los Angeles',
    address: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'Active',
    rating: 4.9,
    vehicle: {
      model: 'Honda Accord 2023',
      plate: 'CA-XYZ789',
      type: 'Sedan'
    },
    totalRides: 312,
    earnings: 16800,
    completionRate: 99,
    documents: [
      { name: 'Driver License', status: 'Verified' },
      { name: 'Vehicle Registration', status: 'Verified' },
      { name: 'Insurance Certificate', status: 'Verified' },
      { name: 'Background Check', status: 'Verified' }
    ]
  },
  {
    id: 'DRV003',
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    phone: '+1 (555) 345-6789',
    city: 'Chicago',
    address: '789 Pine St, Chicago, IL 60601',
    status: 'Pending',
    rating: 0,
    vehicle: {
      model: 'Ford Fusion 2021',
      plate: 'IL-DEF456',
      type: 'Sedan'
    },
    totalRides: 0,
    earnings: 0,
    completionRate: 0,
    documents: [
      { name: 'Driver License', status: 'Pending' },
      { name: 'Vehicle Registration', status: 'Pending' },
      { name: 'Insurance Certificate', status: 'Pending' },
      { name: 'Background Check', status: 'Pending' }
    ]
  },
  {
    id: 'DRV004',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    phone: '+1 (555) 456-7890',
    city: 'Miami',
    address: '321 Beach Blvd, Miami, FL 33101',
    status: 'Inactive',
    rating: 4.5,
    vehicle: {
      model: 'Nissan Altima 2022',
      plate: 'FL-GHI789',
      type: 'Sedan'
    },
    totalRides: 178,
    earnings: 8900,
    completionRate: 95,
    documents: [
      { name: 'Driver License', status: 'Verified' },
      { name: 'Vehicle Registration', status: 'Expired' },
      { name: 'Insurance Certificate', status: 'Expired' },
      { name: 'Background Check', status: 'Verified' }
    ]
  },
  {
    id: 'DRV005',
    name: 'David Wilson',
    email: 'd.wilson@example.com',
    phone: '+1 (555) 567-8901',
    city: 'Seattle',
    address: '654 Rainier Ave, Seattle, WA 98101',
    status: 'Active',
    rating: 4.7,
    vehicle: {
      model: 'Tesla Model 3 2023',
      plate: 'WA-JKL012',
      type: 'Electric'
    },
    totalRides: 412,
    earnings: 22500,
    completionRate: 99,
    documents: [
      { name: 'Driver License', status: 'Verified' },
      { name: 'Vehicle Registration', status: 'Verified' },
      { name: 'Insurance Certificate', status: 'Verified' },
      { name: 'Background Check', status: 'Verified' }
    ]
  }
];

function Drivers() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [drivers, setDrivers] = useState(mockDrivers);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

  // Filter drivers based on search query and status
  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone.includes(searchQuery) ||
      driver.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || driver.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats from mock data
  const stats = {
    activeDrivers: drivers.filter(d => d.status === 'Active').length,
    averageRating: (drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1),
    pendingApprovals: drivers.filter(d => d.status === 'Pending').length,
    totalEarnings: drivers.reduce((acc, d) => acc + d.earnings, 0)
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (driverId, event) => {
    event.stopPropagation();
    setMenuOpen(menuOpen === driverId ? null : driverId);
  };

  return (
    <div className="p-6 bg-gray-100 overflow-y-auto h-full min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>
            <p className="text-gray-600">Manage and monitor your drivers</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-100">
              <Car className="text-blue-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.activeDrivers}</p>
              <p className="text-sm text-gray-500">Active Drivers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-100">
              <Star className="text-green-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-100">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
              <p className="text-sm text-gray-500">Pending Approvals</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-100">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">${stats.totalEarnings.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Earnings</p>
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
              placeholder="Search by name, email, phone, or ID..."
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
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr 
                  key={driver.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedDriver(driver);
                    setIsSidebarOpen(true);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{driver.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-lg font-bold">
                            {driver.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-gray-500">{driver.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.phone}</div>
                    <div className="text-sm text-gray-500">{driver.city}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.vehicle.model}</div>
                    <div className="text-sm text-gray-500">{driver.vehicle.plate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      driver.status === 'Active' ? 'bg-green-100 text-green-800' :
                      driver.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="text-yellow-400" size={16} />
                      <span className="ml-1 text-sm text-gray-900">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={(e) => handleMenuClick(driver.id, e)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {menuOpen === driver.id && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setIsSidebarOpen(true);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <User className="mr-2" size={16} />
                              View Details
                            </button>
                            <button
                              onClick={() => {/* Handle edit */}}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <Edit2 className="mr-2" size={16} />
                              Edit
                            </button>
                            <button
                              onClick={() => {/* Handle status change */}}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              {driver.status === 'Active' ? (
                                <>
                                  <Ban className="mr-2" size={16} />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="mr-2" size={16} />
                                  Activate
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {/* Handle delete */}}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                            >
                              <Trash2 className="mr-2" size={16} />
                              Delete
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

      {/* Driver Details Sidebar */}
      {isSidebarOpen && selectedDriver && (
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
                <h2 className="text-lg font-semibold text-gray-800">Driver Details</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4">
                {/* Driver Profile */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">
                      {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedDriver.name}</h3>
                    <p className="text-gray-500">{selectedDriver.email}</p>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDriver.status === 'Active' ? 'bg-green-100 text-green-800' :
                      selectedDriver.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedDriver.status}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={18} />
                      <span className="text-gray-700">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={18} />
                      <span className="text-gray-700">{selectedDriver.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={18} />
                      <span className="text-gray-700">{selectedDriver.address}</span>
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Vehicle Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Car className="text-gray-400" size={18} />
                      <div>
                        <p className="text-gray-700 font-medium">{selectedDriver.vehicle.model}</p>
                        <p className="text-gray-600">{selectedDriver.vehicle.plate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Navigation className="text-gray-400" size={18} />
                      <span className="text-gray-700">{selectedDriver.vehicle.type}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-500">Total Rides</p>
                      <p className="text-xl font-bold text-gray-900">{selectedDriver.totalRides}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <Star className="text-yellow-400" size={16} />
                        <span className="ml-1 text-xl font-bold text-gray-900">{selectedDriver.rating}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-500">Earnings</p>
                      <p className="text-xl font-bold text-gray-900">${selectedDriver.earnings}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <p className="text-sm text-gray-500">Completion Rate</p>
                      <p className="text-xl font-bold text-gray-900">{selectedDriver.completionRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Documents</h4>
                  <div className="space-y-3">
                    {selectedDriver.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="text-gray-400" size={18} />
                          <span className="text-gray-700">{doc.name}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          doc.status === 'Verified' ? 'bg-green-100 text-green-800' :
                          doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
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

export default Drivers;