import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  Shield,
  ArrowLeft,
  Send,
  MessageSquare,
  Bell,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  X,
  Paperclip,
} from "lucide-react";
import Streak from "../components/Streak";
import AttendanceTrend from "../components/AttendanceTrend";
import RecentTransactions from "../components/RecentTransactions";
import Inbox from "../components/Inbox";
import Outbox from "../components/Outbox";

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info", // info, success, warning, error
    priority: "normal", // low, normal, high
  });
  const [mailData, setMailData] = useState({
    subject: "",
    message: "",
    attachments: [],
    priority: "normal",
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the notification to your backend
    // console.log("Sending notification:", notificationData);
    setShowNotificationModal(false);
    setNotificationData({
      title: "",
      message: "",
      type: "info",
      priority: "normal",
    });
  };

  const handleMailSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the mail to your backend
      // console.log("Sending mail:", mailData);
      setShowMailModal(false);
      setMailData({
        subject: "",
        message: "",
        attachments: [],
        priority: "normal",
      });
    } catch (error) {
      console.error("Error sending mail:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMailData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockClient = {
      userId: id,
      name: "John Doe",
      email: "john@example.com",
      mobile: "+1234567890",
      homeAddress: "123 Home St, City",
      workAddress: "456 Office Ave, City",
      isVerified: true,
      createdAt: "2024-03-15",
      status: "Active",
      timing: "9:00 AM - 6:00 PM",
      weekSchedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      preference: "Triple Sharing",
      package: {
        name: "Monthly Premium",
        price: "₹5000",
        validity: "30 days",
        status: "Active",
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
      },
      transactions: [
        {
          type: "credit",
          amount: 1000,
          description: "Wallet Top-up",
          date: "2024-03-15"
        },
        {
          type: "debit",
          amount: 250,
          description: "Ride from Airport to Downtown",
          date: "2024-03-10"
        },
        {
          type: "debit",
          amount: 180,
          description: "Ride from Office to Home",
          date: "2024-03-05"
        },
        {
          type: "credit",
          amount: 200,
          description: "Ride Cancellation Refund",
          date: "2024-02-28"
        },
        {
          type: "debit",
          amount: 300,
          description: "Premium Ride to Conference Center",
          date: "2024-02-25"
        }
      ],
      inbox: [
        {
          subject: "Welcome to Our Ride Service",
          content: "Thank you for joining our ride service. Your account has been activated. Enjoy your first ride with a 20% discount using code WELCOME20.",
          time: "2 days ago"
        },
        {
          subject: "Ride Receipt #RIDE12345",
          content: "Your ride from Airport to Downtown has been completed. Amount: ₹250. Driver: Mr. Kumar. Rating: 4.8",
          time: "1 week ago"
        },
        {
          subject: "Service Update",
          content: "New premium vehicles are now available in your area. Book a premium ride for special occasions.",
          time: "3 days ago"
        },
        {
          subject: "Driver Feedback Request",
          content: "How was your ride with Mr. Kumar? Please rate your experience to help us improve our service.",
          time: "5 days ago"
        }
      ],
      outbox: [
        {
          subject: "Ride Schedule Request",
          content: "I need a regular ride every weekday from Home to Office at 9:00 AM. Please assign a preferred driver if possible.",
          time: "3 days ago"
        },
        {
          subject: "Complaint - Delayed Ride",
          content: "My ride yesterday was delayed by 20 minutes. The driver didn't inform me about the delay. Please look into this matter.",
          time: "1 week ago"
        },
        {
          subject: "Subscription Plan Query",
          content: "I would like to know more about your monthly subscription plans for regular commuters. Please share the details.",
          time: "2 weeks ago"
        }
      ]
    };
    setClient(mockClient);
  }, [id]);

  if (!client) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 overflow-y-auto h-full min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/clients")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Clients
        </button>
        
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>
            <p className="text-gray-600">View and manage client information</p>
          </div>
          
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* User Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{client.name}</h3>
              <p className="text-gray-500">{client.email}</p>
              <span
                className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : client.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {client.status}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-baseline h-full space-x-2">
            <button
              onClick={() => setShowMailModal(true)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Send Mail"
            >
              <Send size={20} />
            </button>
            <button
              onClick={() => setShowNotificationModal(true)}
              className="p-2 text-gray-400 hover:text-purple-500 transition-colors"
              title="Send Notification"
            >
              <Bell size={20} />
            </button>
            <button
              onClick={() => {/* Handle edit */}}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Edit Client"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => {/* Handle block/active */}}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title={client.status === "Active" ? "Block Client" : "Activate Client"}
            >
              {client.status === "Active" ? <UserX size={20} /> : <UserCheck size={20} />}
            </button>
            <button
              onClick={() => {/* Handle delete */}}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Client"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={18} />
                <span className="text-gray-700">{client.mobile}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-gray-700">{client.email}</span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Address Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-700 font-medium">Home Address</p>
                  <p className="text-gray-600">{client.homeAddress}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-gray-700 font-medium">Work Address</p>
                  <p className="text-gray-600">{client.workAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Schedule Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="text-gray-400" size={18} />
                <span className="text-gray-700">{client.timing}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-gray-400" size={18} />
                <span className="text-gray-700">
                  {client.weekSchedule.join(", ")}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="text-gray-400" size={18} />
                <span className="text-gray-700">{client.preference}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Attendance Streak */}
            <Streak
              attendanceData={client.attendance}
              title="Monthly Attendance"
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
            
            {/* Attendance Trend */}
            <AttendanceTrend 
              attendanceData={client.attendance}
              isExpanded={isExpanded}
              onToggle={() => setIsExpanded(!isExpanded)}
            />
          </div>

          {/* Package Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Package Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="text-gray-400" size={18} />
                <div>
                  <p className="text-gray-700 font-medium">
                    {client.package.name}
                  </p>
                  <p className="text-gray-600">
                    ₹{client.package.price} / {client.package.validity}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions transactions={client.transactions} />

          {/* Messages Section */}
          <div className="grid grid-cols-2 gap-4">
            <Inbox messages={client.inbox} />
            <Outbox messages={client.outbox} />
          </div>
        </div>
      </div>

      {/* Mail Modal */}
      {showMailModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Compose Email</h3>
              </div>
              <button
                onClick={() => setShowMailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="text-gray-500" size={20} />
              </button>
            </div>
            <form onSubmit={handleMailSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={mailData.subject}
                    onChange={(e) =>
                      setMailData({
                        ...mailData,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter email subject"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={mailData.message}
                    onChange={(e) =>
                      setMailData({
                        ...mailData,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[200px]"
                    placeholder="Write your message here..."
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      />
                      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip className="text-gray-500" size={18} />
                        <span className="text-sm font-medium text-gray-700">
                          {isUploading ? "Uploading..." : "Attach Files"}
                        </span>
                      </div>
                    </label>
                    <select
                      value={mailData.priority}
                      onChange={(e) =>
                        setMailData({
                          ...mailData,
                          priority: e.target.value,
                        })
                      }
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="low">Low Priority</option>
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
                {mailData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {mailData.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Paperclip className="text-gray-500" size={16} />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setMailData({
                                ...mailData,
                                attachments: mailData.attachments.filter((_, i) => i !== index),
                              })
                            }
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="text-gray-500" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMailModal(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Send Notification</h3>
              </div>
              <button
                onClick={() => setShowNotificationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="text-gray-500" size={20} />
              </button>
            </div>
            <form onSubmit={handleNotificationSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={notificationData.title}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter notification title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={notificationData.message}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={4}
                    placeholder="Enter your message here..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={notificationData.type}
                      onChange={(e) =>
                        setNotificationData({
                          ...notificationData,
                          type: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="info" className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Info
                      </option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={notificationData.priority}
                      onChange={(e) =>
                        setNotificationData({
                          ...notificationData,
                          priority: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNotificationModal(false)}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientDetails;
