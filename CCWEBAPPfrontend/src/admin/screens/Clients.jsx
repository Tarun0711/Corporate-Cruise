import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, X, MapPin, Phone, Mail, Calendar, Clock, User, Shield, Trash2, CheckCircle2, Ban, Edit2, Mail as MailIcon, Bell } from 'lucide-react';
import Streak from '../components/Streak';

function Clients() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRef = useRef(null);

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

  const handleMenuClick = (userId, event) => {
    event.stopPropagation();
    setMenuOpen(menuOpen === userId ? null : userId);
  };

  const handleAction = (action, user) => {
    setMenuOpen(null);
    // Here you would typically make an API call to update the user's status
    // console.log(`Performing ${action} on user ${user.userId}`);
    
    // Update local state for demo purposes
    setUsers(users.map(u => {
      if (u.userId === user.userId) {
        if (action === 'delete') {
          return { ...u, status: 'Deleted' };
        } else if (action === 'active') {
          return { ...u, status: 'Active' };
        } else if (action === 'blocked') {
          return { ...u, status: 'Blocked' };
        }
      }
      return u;
    }));
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockUsers = [
      {
        userId: 'CC-123456',
        name: 'John Doe',
        email: 'john@example.com',
        mobile: '+1234567890',
        homeAddress: '123 Home St, City',
        workAddress: '456 Office Ave, City',
        isVerified: true,
        createdAt: '2024-03-15',
        status: 'Active',
        timing: '9:00 AM - 6:00 PM',
        weekSchedule: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        preference: 'Triple Sharing',
        package: {
          name: 'Monthly Premium',
          price: '₹5000',
          validity: '30 days',
          status: 'Active'
        },
        attendance: {
          1: true,
          2: true,
          5: true,
          6: true,
          7: true,
          8: true,
          12: true,
          13: true,
          14: true,
          15: true,
          19: true,
          20: true
        }
      },
      {
        userId: 'CC-123457',
        name: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '+1234567891',
        homeAddress: '789 Home St, City',
        workAddress: '012 Office Ave, City',
        isVerified: true,
        createdAt: '2024-03-16',
        status: 'Pending',
        timing: '10:00 AM - 7:00 PM',
        weekSchedule: ['Monday', 'Wednesday', 'Friday'],
        preference: 'Double Sharing',
        package: {
          name: 'Monthly Basic',
          price: '₹3000',
          validity: '30 days',
          status: 'Pending'
        }
      },
    ];

      // console.log('Setting mock users with attendance data:', mockUsers);
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery) ||
      user.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const handleRowClick = (user) => {
    navigate(`/admin/clients/${user.userId}`);
  };

  return (
    <div className="p-6 bg-gray-100 overflow-y-hidden w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <p className="text-gray-600">Manage and view all your clients</p>
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

      {/* Users Table */}
      <div className="bg-white rounded-lg h-full shadow-sm overflow-hidden">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full  divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y overflow-y-auto divide-gray-200">
              {filteredUsers.map((user) => (
                <tr 
                  key={user.userId} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(user)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.homeAddress}</div>
                    <div className="text-sm text-gray-500">{user.workAddress}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative" ref={menuRef}>
                      <button 
                        className="text-gray-400 hover:text-gray-500"
                        onClick={(e) => handleMenuClick(user.userId, e)}
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {menuOpen === user.userId && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                          <div className="py-1">
                            {user.status === 'Blocked' ? (
                              <button
                                onClick={() => handleAction('active', user)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <CheckCircle2 className="mr-2" size={16} />
                                Mark as Active
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAction('blocked', user)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Ban className="mr-2" size={16} />
                                Block User
                              </button>
                            )}
                            <button
                              onClick={() => handleAction('delete', user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 className="mr-2" size={16} />
                              Delete User
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => handleAction('edit', user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit2 className="mr-2" size={16} />
                              Edit Profile
                            </button>
                            <button
                              onClick={() => handleAction('notify', user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Bell className="mr-2" size={16} />
                              Send Notification
                            </button>
                            <button
                              onClick={() => handleAction('email', user)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <MailIcon className="mr-2" size={16} />
                              Send Email
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

      {/* User Details Sidebar */}
      {isSidebarOpen && selectedUser && (
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
                <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4">
                {/* User Profile */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary text-2xl font-bold">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' :
                      selectedUser.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="text-gray-400" size={18} />
                        <span className="text-gray-700">{selectedUser.mobile}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="text-gray-400" size={18} />
                        <span className="text-gray-700">{selectedUser.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Address Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-gray-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-700 font-medium">Home Address</p>
                          <p className="text-gray-600">{selectedUser.homeAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-gray-400 mt-1" size={18} />
                        <div>
                          <p className="text-gray-700 font-medium">Work Address</p>
                          <p className="text-gray-600">{selectedUser.workAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Schedule Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="text-gray-400" size={18} />
                        <span className="text-gray-700">{selectedUser.timing}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="text-gray-400" size={18} />
                        <span className="text-gray-700">{selectedUser.weekSchedule.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <User className="text-gray-400" size={18} />
                        <span className="text-gray-700">{selectedUser.preference}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Streak */}
                  <Streak 
                    attendanceData={selectedUser?.attendance || {}} 
                    title="Monthly Attendance"
                  />

                  {/* Package Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Package Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Shield className="text-gray-400" size={18} />
                        <div>
                          <p className="text-gray-700 font-medium">{selectedUser.package.name}</p>
                          <p className="text-gray-600">₹{selectedUser.package.price} / {selectedUser.package.validity}</p>
                        </div>
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

export default Clients;
