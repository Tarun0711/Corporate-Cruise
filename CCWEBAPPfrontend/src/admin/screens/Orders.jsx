import React, { useState, useEffect } from "react";
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
  Plus,
  Calendar,
  Phone,
  Mail,
  Loader,
  MenuIcon,
} from "lucide-react";
import UserStatusService from "../../services/operations/userStatusService";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, pagination.page, pagination.limit]);
  const { token } = useSelector((state) => state.auth);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await UserStatusService.getUsersByStatus(
        {
          status: filterStatus === "all" ? undefined : filterStatus,
          page: pagination.page,
          limit: pagination.limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        },
        token
      );
      setOrders(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Convert backend data to frontend format
  const formattedOrders = orders.map((order) => ({
    id: order.userId,
    customer: {
      name: order.name,
      phone: order.mobile || "N/A",
      email: order.email,
      homeAddress: order.homeAddress,
      workAddress: order.workAddress,
    },
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString(),
    time: new Date(order.createdAt).toLocaleTimeString(),
    passengers: order.passengers || "N/A", // Add passengers if available
    fare: order.fare || "N/A", // Add fare if available
    paymentMethod: order.paymentMethod || "N/A", // Add payment method if available
    specialRequests: order.specialRequests || null, // Add special requests if available
  }));

  //     {
  //         id: 'O001',
  //         customer: {
  //             name: 'Sarah Smith',
  //             phone: '+1 234 567 8901',
  //             email: 'sarah@example.com'
  //         },
  //         pickup: '123 Main St, New York',
  //         dropoff: '456 Market St, Brooklyn',
  //         status: 'Pending',
  //         fare: '$25.00',
  //         date: '2024-03-15',
  //         time: '09:30 AM',
  //         passengers: 2,
  //         specialRequests: 'Need child seat',
  //         paymentMethod: 'Credit Card'
  //     },
  //     {
  //         id: 'O002',
  //         customer: {
  //             name: 'Mike Johnson',
  //             phone: '+1 234 567 8902',
  //             email: 'mike@example.com'
  //         },
  //         pickup: '789 Park Ave, Manhattan',
  //         dropoff: '321 Broadway, Queens',
  //         status: 'Confirmed',
  //         fare: '$35.00',
  //         date: '2024-03-15',
  //         time: '10:45 AM',
  //         passengers: 3,
  //         specialRequests: 'None',
  //         paymentMethod: 'PayPal'
  //     },
  //     // Add more sample orders...
  // ];

  const filteredOrders = formattedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setIsSidebarOpen(true);
  };
  const handleAction = async (action, order) => {
    try {
      let newStatus = "";
  
      // Map actions to statuses
      if (action === "routing") {
        newStatus = "routing";
      } else if (action === "payment") {
        newStatus = "payment";
      } else if (action === "assign_driver") {
        newStatus = "AssigningDriver";
      } else if (action === "completed") {
        newStatus = "completed";
      }
  
      // Update user status via API
      if (newStatus) {
        await UserStatusService.updateUserStatus(order.id, newStatus, token);
        toast.success(`Order status updated to ${newStatus}`);
      }
  
      // Refresh orders list
      await fetchOrders();
      setMenuOpen(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order status";
      toast.error(errorMessage);
    }
  };
  const truncateText = (text, wordLimit) => {
    if (!text || typeof text !== "string") return text; // Ensure text is a valid string
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className="p-6 relative bg-gray-100 overflow-y-hidden w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ride Orders</h1>
        <p className="text-gray-600">Manage and monitor all ride requests</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-100">
              <AlertCircle className="text-blue-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">12</p>
              <p className="text-sm text-gray-500">Pending Orders</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">45</p>
              <p className="text-sm text-gray-500">Confirmed Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">8</p>
              <p className="text-sm text-gray-500">Scheduled for Today</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-100">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">$1,245</p>
              <p className="text-sm text-gray-500">Today's Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by ID, customer, location..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        )}
        <div className="overflow-x-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fare
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 overflow-auto relative z-auto cursor-pointer"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {order.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="text-gray-400 mr-2" size={16} />
                      <div className="text-sm text-gray-900">
                        {truncateText(
                          order.customer.homeAddress?.address || "N/A",
                          2
                        )}{" "}
                        →{" "}
                        {truncateText(
                          order.customer.workAddress?.address || "N/A",
                          2
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={16} />
                      <div className="text-sm text-gray-900">
                        {order.date} at {order.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.fare}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap overflow-visible text-right text-sm font-medium">
                    <div className="relative overflow-visible">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === order.id ? null : order.id);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MenuIcon size={20} />
                      </button>
                      {menuOpen === order.id && (
                       <div
                       className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                       style={{
                         zIndex: 1050, 
                       }}
                     >
                          <div className="py-1">
                            {/* Dynamically render status options */}
                            {order.status === "under_verification" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction("routing", order);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <MapPin
                                  className="mr-2 text-blue-500"
                                  size={16}
                                />
                                Move to Routing
                              </button>
                            )}
                            {order.status === "routing" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction("payment", order);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <DollarSign
                                  className="mr-2 text-green-500"
                                  size={16}
                                />
                                Move to Payment
                              </button>
                            )}
                            {order.status === "payment" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction("assign_driver", order);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <User
                                  className="mr-2 text-purple-500"
                                  size={16}
                                />
                                Assign Driver
                              </button>
                            )}
                            {order.status === "AssigningDriver" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction("completed", order);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <CheckCircle2
                                  className="mr-2 text-green-600"
                                  size={16}
                                />
                                Mark as Completed
                              </button>
                            )}
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

      {/* Order Details Sidebar */}
      {isSidebarOpen && selectedOrder && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50  z-50 flex items-center justify-end"
          onClick={() => setIsSidebarOpen(false)} // Close modal on backdrop click
        >
          <div
            className="relative h-full w-[600px] animate-slideIn bg-white shadow-xl transform transition-all overflow-y-auto duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order Details
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4">
                {/* Order Status */}
                <div className="mb-6">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      selectedOrder.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedOrder.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Route Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Pickup Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.homeAddress.address}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">
                          Dropoff Location
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.customer.workAddress.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">
                    Order Details
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Date & Time</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.date} at {selectedOrder.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Passengers</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.passengers}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Fare</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.fare}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="text-gray-400" size={18} />
                      <div>
                        <p className="text-sm text-gray-700">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedOrder.specialRequests && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Special Requests
                    </h4>
                    <p className="text-sm text-gray-900">
                      {selectedOrder.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
