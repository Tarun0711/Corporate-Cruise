import React, { useState, useEffect, useRef } from 'react';
import { 
  FiUser, FiFilter, FiSearch, FiEye, FiEdit, FiTrash2, FiCheck, FiX, 
  FiAlertCircle, FiClock, FiUserCheck, FiUserX, FiRefreshCw, FiMail, 
  FiPhone, FiDollarSign, FiFileText, FiClipboard, FiCalendar, FiBarChart2,
  FiPieChart, FiUsers, FiActivity, FiMessageSquare, FiSend, FiCheckCircle,
  FiMapPin, FiMoreVertical, FiNavigation
} from 'react-icons/fi';
import { formatDistanceToNow, format, parseISO, isValid } from 'date-fns';
import UserStatusService from '../../services/operations/userStatusService';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { apiConnector } from '../../services/apiconnector';
import { profileEndpoints } from '../../services/api';
import ConfirmationModal from '../components/ConfirmationModal';

// Helper functions to safely format dates
const safeFormatDate = (dateString, formatString) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatString) : 'Invalid date';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

const safeFormatDistanceToNow = (dateString, options = {}) => {
  try {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isValid(date) ? formatDistanceToNow(date, options) : 'Invalid date';
  } catch (error) {
    console.error('Date distance formatting error:', error);
    return 'Invalid date';
  }
};

function Users() {
  // Main state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'leads', 'onboarding', 'verified'
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Sorting and filtering state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('under_verfication');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    registrationDate: null,
    paymentStatus: '',
    onboardingStatus: '',
    routeStatus: ''
  });
  
  // Dashboard metrics
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingVerification: 0,
    incompleteOnboarding: 0,
    recentRegistrations: 0,
    paymentCompleted: 0
  });
  
  // Activity logs
  const [activityLogs, setActivityLogs] = useState([]);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  
  // Communication
  const [messageText, setMessageText] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  
  // Document verification
  const [documents, setDocuments] = useState([]);
  const [showDocuments, setShowDocuments] = useState(false);
  
  // Refs
  const messageInputRef = useRef(null);
  
  // Add this state near the other state declarations
  const [showActionMenu, setShowActionMenu] = useState({});
  const [showRoutingStatus, setShowRoutingStatus] = useState(false);
  const [showRoutingConfirmation, setShowRoutingConfirmation] = useState(false);
  const [pendingRoutingStatus, setPendingRoutingStatus] = useState(null);
  const [pendingUserId, setPendingUserId] = useState(null);
  
  const { token } = useSelector(state => state.auth);
  
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare query parameters based on view mode and filters
      let params = {
        status: 'under_verfication', // Always fetch under verification users
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        search: searchTerm
      };
      
      // Add advanced filters if they're set
      if (advancedFilters.registrationDate) {
        params.registrationDate = advancedFilters.registrationDate;
      }
      
      if (advancedFilters.paymentStatus) {
        params.paymentStatus = advancedFilters.paymentStatus;
      }
      
      if (advancedFilters.onboardingStatus) {
        params.onboardingStatus = advancedFilters.onboardingStatus;
      }
      
      if (advancedFilters.routeStatus) {
        params.routeStatus = advancedFilters.routeStatus;
      }
      
      const response = await UserStatusService.getUsersByStatus('under_verification', token);
      
      setUsers(response.users);
      setPagination({
        ...pagination,
        total: response.pagination.total,
        pages: response.pagination.pages
      });
      
      // Calculate dashboard metrics
      calculateMetrics(response.users, response.pagination.total);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        setError('Unauthorized: You need admin privileges to access this data.');
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later or contact support.');
        toast.error('Server error occurred');
      } else {
        setError(error.message || 'Failed to load users. Please try again later.');
        toast.error('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate dashboard metrics from user data
  const calculateMetrics = (userData, totalCount) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const activeCount = userData.filter(user => user.status === 'active').length;
    const pendingVerificationCount = userData.filter(user => user.status === 'under_verfication').length;
    const incompleteOnboardingCount = userData.filter(user => 
      !user.profile || !user.profile.isCompleted
    ).length;
    
    const recentRegistrationsCount = userData.filter(user => 
      new Date(user.createdAt) >= oneWeekAgo
    ).length;
    
    setMetrics({
      totalUsers: totalCount,
      activeUsers: activeCount,
      pendingVerification: pendingVerificationCount,
      incompleteOnboarding: incompleteOnboardingCount,
      recentRegistrations: recentRegistrationsCount
    });
  };

  const fetchOnboardingStatus = async (userId) => {
    try {
      const response = await apiConnector(
        'GET',
        `${profileEndpoints.GET_ONBOARDING_STATUS}/${userId}`,
        null,
        {
          Authorization: `Bearer ${token}`
        }
      );

      if (response.data && response.data.success) {
        const onboardingData = response.data.data;
        
        // Update the selected user with onboarding details
        setSelectedUser(prevUser => ({
          ...prevUser,
          onboarding: onboardingData
        }));
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
      toast.error('Failed to fetch onboarding details');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, sortBy, sortOrder, statusFilter, viewMode]);

  // Fetch user activity logs
  const fetchUserActivityLogs = async (userId) => {
    try {
      // This would be a real API call in production
      // For now, we'll simulate activity logs
      const mockLogs = [
        { id: 1, userId, action: 'Login', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'User logged in successfully' },
        { id: 2, userId, action: 'Profile Update', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'User updated profile information' },
        { id: 3, userId, action: 'Document Upload', timestamp: new Date(Date.now() - 172800000).toISOString(), details: 'User uploaded verification documents' },
        { id: 4, userId, action: 'Payment', timestamp: new Date(Date.now() - 259200000).toISOString(), details: 'User completed payment' },
        { id: 5, userId, action: 'Onboarding Step', timestamp: new Date(Date.now() - 345600000).toISOString(), details: 'User completed onboarding step 2/4' }
      ];
      
      setActivityLogs(mockLogs);
      return mockLogs;
    } catch (error) {
      console.error('Error fetching user activity logs:', error);
      toast.error('Failed to load user activity');
      return [];
    }
  };
  
  // Fetch user documents
  const fetchUserDocuments = async (userId) => {
    try {
      // This would be a real API call in production
      // For now, we'll simulate document data
      const mockDocuments = [
        { id: 1, userId, type: 'ID Proof', status: 'verified', uploadDate: new Date(Date.now() - 345600000).toISOString(), verifiedDate: new Date(Date.now() - 172800000).toISOString() },
        { id: 2, userId, type: 'Address Proof', status: 'pending', uploadDate: new Date(Date.now() - 259200000).toISOString(), verifiedDate: null },
        { id: 3, userId, type: 'Vehicle Registration', status: 'rejected', uploadDate: new Date(Date.now() - 432000000).toISOString(), verifiedDate: null, rejectionReason: 'Document unclear' }
      ];
      
      setDocuments(mockDocuments);
      return mockDocuments;
    } catch (error) {
      console.error('Error fetching user documents:', error);
      toast.error('Failed to load user documents');
      return [];
    }
  };

  // Update user status
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await UserStatusService.updateUserStatus(userId, newStatus, token);
      
      // Update the user in the local state
      setUsers(users.map(user => 
        user.userId === userId ? { ...user, status: newStatus } : user
      ));
      
      // If the selected user is the one being updated, update that too
      if (selectedUser && selectedUser.userId === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      
      toast.success(`User status updated to ${newStatus}`);
      return response;
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
      throw error;
    }
  };
  
  // Send message to user
  const sendMessageToUser = async (userId, message) => {
    try {
      // This would be a real API call in production
      // For now, we'll just simulate success
      toast.success('Message sent successfully');
      setMessageText('');
      setShowMessageForm(false);
      
      // Add to activity logs
      const newLog = { 
        id: activityLogs.length + 1, 
        userId, 
        action: 'Message Sent', 
        timestamp: new Date().toISOString(), 
        details: `Admin sent message: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}` 
      };
      
      setActivityLogs([newLog, ...activityLogs]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };
  
  // Handle document verification
  const handleDocumentVerification = async (documentId, verificationStatus, rejectionReason = null) => {
    try {
      // This would be a real API call in production
      // For now, we'll update the local state
      const updatedDocuments = documents.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: verificationStatus, 
              verifiedDate: verificationStatus === 'verified' ? new Date().toISOString() : null,
              rejectionReason: verificationStatus === 'rejected' ? rejectionReason : null
            } 
          : doc
      );
      
      setDocuments(updatedDocuments);
      toast.success(`Document ${verificationStatus}`);
      
      // Add to activity logs
      const newLog = { 
        id: activityLogs.length + 1, 
        userId: selectedUser.userId, 
        action: 'Document Verification', 
        timestamp: new Date().toISOString(), 
        details: `Document ID ${documentId} ${verificationStatus}` 
      };
      
      setActivityLogs([newLog, ...activityLogs]);
      return true;
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Failed to verify document');
      return false;
    }
  };
  
  // Handle user edit
  const handleEditUser = (user) => {
    setEditingUser({...user});
  };
  
  // Save edited user
  const saveUserEdit = async () => {
    try {
      // This would be a real API call in production
      // For now, we'll update the local state
      setUsers(users.map(user => 
        user.userId === editingUser.userId ? editingUser : user
      ));
      
      // If the selected user is the one being edited, update that too
      if (selectedUser && selectedUser.userId === editingUser.userId) {
        setSelectedUser(editingUser);
      }
      
      setEditingUser(null);
      toast.success('User information updated');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user information');
      return false;
    }
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingUser(null);
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage
    });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination({
      ...pagination,
      page: 1
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRowClick = async (user) => {
    setSelectedUser(user);
    await fetchOnboardingStatus(user.userId);
    fetchUserActivityLogs(user.userId);
    fetchUserDocuments(user.userId);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setShowActivityLogs(false);
    setShowDocuments(false);
    setShowMessageForm(false);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setPagination({
      ...pagination,
      page: 1
    });
  };
  
  const handleAdvancedFilterChange = (filterName, value) => {
    setAdvancedFilters({
      ...advancedFilters,
      [filterName]: value
    });
  };
  
  const applyAdvancedFilters = () => {
    setPagination({
      ...pagination,
      page: 1
    });
    fetchUsers();
  };
  
  const resetAdvancedFilters = () => {
    setAdvancedFilters({
      registrationDate: null,
      paymentStatus: '',
      onboardingStatus: '',
      routeStatus: ''
    });
    setPagination({
      ...pagination,
      page: 1
    });
    fetchUsers();
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'suspended': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'under_verfication': 'bg-blue-100 text-blue-800',
      'incomplete_onboarding': 'bg-orange-100 text-orange-800',
      'ready_for_verification': 'bg-indigo-100 text-indigo-800',
      'under_review': 'bg-purple-100 text-purple-800',
      'confirmed': 'bg-teal-100 text-teal-800',
      'rejected': 'bg-red-100 text-red-800',
      'payment_pending': 'bg-yellow-100 text-yellow-800',
      'payment_completed': 'bg-green-100 text-green-800',
      'route_assigned': 'bg-blue-100 text-blue-800',
      'route_pending': 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };
  
  const renderPaymentStatusBadge = (status) => {
    const statusMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };
  
  const renderOnboardingStatusBadge = (user) => {
    if (!user.profile) return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Incomplete
      </span>
    );

    return user.profile.isCompleted ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Incomplete
      </span>
    );
  };

  const renderUserDetails = () => {
    if (!selectedUser?.profile) return (
      <div className="text-gray-500 text-sm">No profile information available</div>
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Onboarding Status</h4>
          <span className={`text-sm font-medium ${selectedUser.profile.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
            {selectedUser.profile.isCompleted ? 'Completed' : 'Incomplete'}
          </span>
        </div>
        
        {selectedUser.profile.isCompleted && (
          <div className="space-y-2 mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Gender:</span> {selectedUser.profile.gender}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Office Hours:</span> {selectedUser.profile.officeTimings.inTime} - {selectedUser.profile.officeTimings.outTime}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Sharing Preference:</span> {selectedUser.profile.sharing}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Working Days:</span> {selectedUser.profile.workingDays.join(', ')}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">One Side Route:</span> {selectedUser.profile.oneSideRoute}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProfileDetailsSection = () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm mb-2">
            <span className="font-medium">Email: </span>
            {selectedUser.email}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Phone: </span>
            {selectedUser.mobile}
          </p>
          <p className="text-sm">
            <span className="font-medium">Verified: </span>
            {selectedUser.isVerified ? 'Yes' : 'No'}
          </p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Address Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm mb-2">
            <span className="font-medium">Home Address: </span>
            {typeof selectedUser.homeAddress === 'object' 
              ? (selectedUser.homeAddress?.address || 'Not provided') 
              : (selectedUser.homeAddress || 'Not provided')}
          </p>
          <p className="text-sm">
            <span className="font-medium">Work Address: </span>
            {typeof selectedUser.workAddress === 'object' 
              ? (selectedUser.workAddress?.address || 'Not provided') 
              : (selectedUser.workAddress || 'Not provided')}
          </p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Onboarding Status</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {renderUserDetails()}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Referral Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm mb-2">
            <span className="font-medium">Referral ID: </span>
            {selectedUser.referralId || 'None'}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Referral Count: </span>
            {selectedUser.referralCount || 0}
          </p>
          <p className="text-sm">
            <span className="font-medium">Referred Users: </span>
            {selectedUser.referredUsers?.length || 0}
          </p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Profile Details</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          {selectedUser.profile ? (
            <>
              <p className="text-sm mb-2">
                <span className="font-medium">Gender: </span>
                {selectedUser.profile.gender || 'Not provided'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Working Days: </span>
                {selectedUser.profile.workingDays?.join(', ') || 'Not provided'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Sharing Preference: </span>
                {selectedUser.profile.sharing || 'Not provided'}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">One-Side Route: </span>
                {selectedUser.profile.oneSideRoute || 'Not provided'}
              </p>
              {selectedUser.profile.officeTimings && (
                <div className="mt-3 border-t border-gray-200 pt-3">
                  <p className="text-sm font-medium mb-2">Office Timings:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">In Time</p>
                      <p className="text-sm">{selectedUser.profile.officeTimings.inTime || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Out Time</p>
                      <p className="text-sm">{selectedUser.profile.officeTimings.outTime || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">No profile information available</p>
          )}
        </div>
      </div>
      
      <div className="md:col-span-2">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Account Information</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Registered: </span>
              </p>
              <p className="text-sm text-gray-600">
                {safeFormatDate(selectedUser.createdAt, 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Last Updated: </span>
              </p>
              <p className="text-sm text-gray-600">
                {safeFormatDate(selectedUser.updatedAt, 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Last Login: </span>
              </p>
              <p className="text-sm text-gray-600">
                {selectedUser.lastLogin ? safeFormatDate(selectedUser.lastLogin, 'MMM d, yyyy h:mm a') : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add this function near the other handler functions
  const toggleActionMenu = (userId) => {
    setShowActionMenu(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleRoutingStatus = async (userId, status, e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the row click handler
    try {
      setPendingUserId(userId);
      setPendingRoutingStatus(status);
      setShowRoutingConfirmation(true);
    } catch (error) {
      console.error('Error preparing routing status update:', error);
      toast.error('Failed to prepare routing status update');
    }
  };

  const confirmRoutingStatus = async () => {
    try {
      if (!pendingUserId || !pendingRoutingStatus) {
        toast.error('Missing user ID or routing status');
        return;
      }

      await UserStatusService.updateRoutingStatus(pendingUserId, pendingRoutingStatus, token);
      toast.success(`User routing status updated to ${pendingRoutingStatus}`);
      setShowRoutingConfirmation(false);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error updating routing status:', error);
      toast.error(error.response?.data?.error || 'Failed to update routing status');
    } finally {
      setPendingUserId(null);
      setPendingRoutingStatus(null);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">User Management CRM</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchUsers()}
            className="flex items-center px-4 py-2 bg-blue-100 rounded-lg text-blue-700 hover:bg-blue-200"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
          <div className="relative">
            <button
              className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="mr-2" /> Filter
            </button>
            <div className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 ${isFilterOpen ? 'block' : 'hidden'}`}>
              <div className="py-1 px-2">
                <div className="border-b pb-2 mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">User Status</p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        handleStatusFilter('');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        handleStatusFilter('active');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        handleStatusFilter('under_verfication');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Under Verification
                    </button>
                    <button
                      onClick={() => {
                        handleStatusFilter('inactive');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Inactive
                    </button>
                    <button
                      onClick={() => {
                        handleStatusFilter('incomplete_onboarding');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Incomplete Onboarding
                    </button>
                    <button
                      onClick={() => {
                        handleStatusFilter('ready_for_verification');
                        setIsFilterOpen(false);
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Ready for Verification
                    </button>
                  </div>
                </div>
                
                <div className="border-b pb-2 mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment Status</p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        handleAdvancedFilterChange('paymentStatus', 'pending');
                        setIsFilterOpen(false);
                        applyAdvancedFilters();
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => {
                        handleAdvancedFilterChange('paymentStatus', 'completed');
                        setIsFilterOpen(false);
                        applyAdvancedFilters();
                      }}
                      className="block px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 w-full text-left rounded"
                    >
                      Completed
                    </button>
                  </div>
                </div>
                
                <div>
                  <button
                    onClick={() => {
                      resetAdvancedFilters();
                      setIsFilterOpen(false);
                    }}
                    className="block px-3 py-1 text-xs text-blue-700 hover:bg-blue-50 w-full text-center rounded border border-blue-200 mt-2"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            >
              <FiSearch />
            </button>
          </form>
        </div>
      </div>
      
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FiUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold">{metrics.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FiUserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-xl font-bold">{metrics.activeUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FiAlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <p className="text-xl font-bold">{metrics.pendingVerification}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-500 mr-4">
              <FiClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Incomplete Onboarding</p>
              <p className="text-xl font-bold">{metrics.incompleteOnboarding}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recent Registrations</p>
              <p className="text-xl font-bold">{metrics.recentRegistrations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Completed</p>
              <p className="text-xl font-bold">{metrics.paymentCompleted}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Mode Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${viewMode === 'all' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleViewModeChange('all')}
        >
          All Users
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${viewMode === 'leads' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleViewModeChange('leads')}
        >
          Leads
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${viewMode === 'onboarding' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleViewModeChange('onboarding')}
        >
          Incomplete Onboarding
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${viewMode === 'verified' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => handleViewModeChange('verified')}
        >
          Verified Users
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('userId')}
                    >
                      User ID
                      {sortBy === 'userId' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      Name
                      {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      Email
                      {sortBy === 'email' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('mobile')}
                    >
                      Phone
                      {sortBy === 'mobile' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('location')}
                    >
                      Location
                      {sortBy === 'location' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Onboarding Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('createdAt')}
                    >
                      Registered
                      {sortBy === 'createdAt' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y overflow-y-auto divide-gray-200">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.userId}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(user)}
                      >
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.userId}
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.name}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiMail className="mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        </td> */}

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiPhone className="mr-2 text-gray-400" />
                            {user.mobile}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-2">
                            <div className="group relative flex items-center bg-gray-50 p-2 rounded-lg">
                              <FiMapPin className="mr-2 text-blue-500" />
                              <span className="truncate max-w-[200px]">
                                {user.homeAddress.address.length > 20 
                                  ? `${user.homeAddress.address.substring(0, 20)}...`
                                  : user.homeAddress.address}
                              </span>
                              <div className="absolute left-0 top-full mt-1 w-auto p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <div className="flex items-center">
                                  <FiMapPin className="mr-2 text-blue-400" />
                                  <span>{user.homeAddress.address}</span>
                                </div>
                              </div>
                            </div>
                            <div className="group relative flex items-center bg-gray-50 p-2 rounded-lg">
                              <FiMapPin className="mr-2 text-green-500" />
                              <span className="truncate max-w-[200px]">
                                {user.workAddress.address.length > 20 
                                  ? `${user.workAddress.address.substring(0, 20)}...`
                                  : user.workAddress.address}
                              </span>
                              <div className="absolute left-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <div className="flex items-center">
                                  <FiMapPin className="mr-2 text-green-400" />
                                  <span>{user.workAddress.address}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(user.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderOnboardingStatusBadge(user)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>{safeFormatDate(user.createdAt, 'MMM d, yyyy')}</span>
                            <span className="text-xs text-gray-400">{safeFormatDistanceToNow(user.createdAt, { addSuffix: true })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                toggleActionMenu(user.userId);
                              }}
                              title="Actions"
                            >
                              <FiMoreVertical />
                            </button>
                            
                            {showActionMenu[user.userId] && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRowClick(user);
                                      toggleActionMenu(user.userId);
                                    }}
                                  >
                                    <FiEye className="mr-2" /> View Details
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditUser(user);
                                      toggleActionMenu(user.userId);
                                    }}
                                  >
                                    <FiEdit className="mr-2" /> Edit User
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedUser(user);
                                      setShowMessageForm(true);
                                      toggleActionMenu(user.userId);
                                    }}
                                  >
                                    <FiMessageSquare className="mr-2" /> Send Message
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedUser(user);
                                      setShowDocuments(true);
                                      toggleActionMenu(user.userId);
                                    }}
                                  >
                                    <FiFileText className="mr-2" /> View Documents
                                  </button>
                                  <button
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRoutingStatus(user.userId, 'routing', e);
                                      toggleActionMenu(user.userId);
                                    }}
                                  >
                                    <FiNavigation className="mr-2" /> Set as Routing
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> of{' '}
              <span className="font-medium">{pagination.total}</span> users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 border rounded-md ${
                  pagination.page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = pagination.page > 3 
                  ? pagination.page - 3 + i + 1
                  : i + 1;
                
                if (pageNum <= pagination.pages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 border rounded-md ${
                        pagination.page === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 border rounded-md ${
                  pagination.page === pagination.pages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* User Details Modal */}
      {selectedUser && !editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              {/* User Header with Quick Actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FiUser className="h-10 w-10 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.userId}</p>
                    <div className="mt-1 flex space-x-2">
                      {renderStatusBadge(selectedUser.status)}
                      {selectedUser.paymentStatus && renderPaymentStatusBadge(selectedUser.paymentStatus)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    onClick={(e) => handleEditUser(selectedUser)}
                  >
                    <FiEdit className="mr-1" /> Edit
                  </button>
                  <button 
                    className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    onClick={(e) => updateUserStatus(selectedUser.userId, 'active')}
                  >
                    <FiUserCheck className="mr-1" /> Activate
                  </button>
                  <button 
                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    onClick={(e) => updateUserStatus(selectedUser.userId, 'suspended')}
                  >
                    <FiUserX className="mr-1" /> Suspend
                  </button>
                  <button 
                    className="flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    onClick={(e) => setShowMessageForm(!showMessageForm)}
                  >
                    <FiMessageSquare className="mr-1" /> Message
                  </button>
                </div>
              </div>
              
              {/* Tabs for different sections */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    className="py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600"
                    onClick={() => {
                      setShowActivityLogs(false);
                      setShowDocuments(false);
                      setShowMessageForm(false);
                    }}
                  >
                    Profile Details
                  </button>
                  <button
                    className={`py-2 px-1 font-medium text-sm ${showActivityLogs ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
                    onClick={() => {
                      setShowActivityLogs(true);
                      setShowDocuments(false);
                      setShowMessageForm(false);
                    }}
                  >
                    Activity Log
                  </button>
                  <button
                    className={`py-2 px-1 font-medium text-sm ${showDocuments ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`}
                    onClick={() => {
                      setShowActivityLogs(false);
                      setShowDocuments(true);
                      setShowMessageForm(false);
                    }}
                  >
                    Documents
                  </button>
                </nav>
              </div>
              
              {/* Message Form */}
              {showMessageForm && (
                <div className="mb-6 bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Send Message to User</h4>
                  <textarea
                    ref={messageInputRef}
                    className="w-full p-2 border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    rows="3"
                    placeholder="Type your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      onClick={() => setShowMessageForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      onClick={() => sendMessageToUser(selectedUser.userId, messageText)}
                      disabled={!messageText.trim()}
                    >
                      <FiSend className="inline mr-1" /> Send
                    </button>
                  </div>
                </div>
              )}
              
              {/* Activity Logs */}
              {showActivityLogs ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 className="font-medium text-gray-700">User Activity History</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{log.action}</p>
                              <p className="text-sm text-gray-600">{log.details}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {safeFormatDate(log.timestamp, 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No activity logs found</div>
                    )}
                  </div>
                </div>
              ) : showDocuments ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-medium text-gray-700">User Documents</h4>
                    <button className="text-sm text-blue-600 hover:text-blue-800">Request Documents</button>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {documents.length > 0 ? (
                      documents.map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className="p-2 bg-blue-100 text-blue-700 rounded mr-3">
                                <FiFileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{doc.type}</p>
                                <p className="text-sm text-gray-600">
                                  Uploaded: {safeFormatDate(doc.uploadDate, 'MMM d, yyyy')}
                                </p>
                                {doc.status === 'rejected' && (
                                  <p className="text-sm text-red-600 mt-1">
                                    Rejection reason: {doc.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {doc.status === 'pending' ? (
                                <>
                                  <button 
                                    className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                                    onClick={(e) => handleDocumentVerification(doc.id, 'verified')}
                                    title="Verify Document"
                                  >
                                    <FiCheck />
                                  </button>
                                  <button 
                                    className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                    onClick={(e) => handleDocumentVerification(doc.id, 'rejected', 'Document unclear or invalid')}
                                    title="Reject Document"
                                  >
                                    <FiX />
                                  </button>
                                </>
                              ) : (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  doc.status === 'verified' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {doc.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No documents found</div>
                    )}
                  </div>
                </div>
              ) : (
                renderProfileDetailsSection()
              )}
              
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingUser.mobile || ''}
                    onChange={(e) => setEditingUser({...editingUser, mobile: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingUser.status || ''}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                    <option value="under_verfication">Under Verification</option>
                    <option value="incomplete_onboarding">Incomplete Onboarding</option>
                    <option value="ready_for_verification">Ready for Verification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={
                      typeof editingUser.homeAddress === 'object' 
                        ? (editingUser.homeAddress?.address || '') 
                        : (editingUser.homeAddress || '')
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const updatedAddress = typeof editingUser.homeAddress === 'object'
                        ? { ...editingUser.homeAddress, address: newValue }
                        : newValue;
                      setEditingUser({...editingUser, homeAddress: updatedAddress});
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={
                      typeof editingUser.workAddress === 'object' 
                        ? (editingUser.workAddress?.address || '') 
                        : (editingUser.workAddress || '')
                    }
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const updatedAddress = typeof editingUser.workAddress === 'object'
                        ? { ...editingUser.workAddress, address: newValue }
                        : newValue;
                      setEditingUser({...editingUser, workAddress: updatedAddress});
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editingUser.paymentStatus || 'pending'}
                    onChange={(e) => setEditingUser({...editingUser, paymentStatus: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verified</label>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={editingUser.isVerified || false}
                      onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.checked})}
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      User is verified
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Routing Status Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRoutingConfirmation}
        onClose={() => {
          setShowRoutingConfirmation(false);
          setPendingUserId(null);
          setPendingRoutingStatus(null);
        }}
        onConfirm={confirmRoutingStatus}
        title="Confirm Routing Status Change"
        message={`Are you sure you want to set the routing status to "${pendingRoutingStatus}"?`}
        confirmText="Set Status"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
}

export default Users;