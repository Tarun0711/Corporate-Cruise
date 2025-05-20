import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiDownload, FiCalendar, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const DashboardPayments = () => {
  const [activeTab, setActiveTab] = useState('history');
  
  // Mock payment history data - would come from backend
  const paymentHistory = [
    { id: 'INV-2023-11', date: 'Nov 01, 2023', amount: '₹2,499', status: 'Paid', method: 'Credit Card' },
    { id: 'INV-2023-10', date: 'Oct 01, 2023', amount: '₹2,499', status: 'Paid', method: 'Credit Card' },
    { id: 'INV-2023-09', date: 'Sep 01, 2023', amount: '₹2,499', status: 'Paid', method: 'UPI' },
    { id: 'INV-2023-08', date: 'Aug 01, 2023', amount: '₹2,499', status: 'Paid', method: 'NetBanking' },
  ];

  // Mock payment methods - would come from backend
  const paymentMethods = [
    { id: 1, type: 'Credit Card', last4: '4242', expiry: '12/24', default: true },
    { id: 2, type: 'UPI', upiId: 'user@okicici', default: false },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-4 text-center font-medium text-sm ${
            activeTab === 'history' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Payment History
        </button>
        <button 
          onClick={() => setActiveTab('methods')}
          className={`flex-1 py-4 text-center font-medium text-sm ${
            activeTab === 'methods' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Payment Methods
        </button>
      </div>

      <div className="p-6">
        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Payment History</h3>
              <button className="text-primary text-sm flex items-center hover:underline">
                <FiDownload className="mr-1" /> Export
              </button>
            </div>

            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <motion.tr key={payment.id} variants={itemVariants}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{payment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{payment.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.method}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary hover:text-primary-dark hover:underline cursor-pointer">
                          View Receipt
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                  <FiDollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No payment history</h3>
                <p className="text-gray-500 mt-1">You haven't made any payments yet.</p>
              </div>
            )}

            {/* Next Payment Panel */}
            <motion.div 
              className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50" 
              variants={itemVariants}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Next Payment</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">Dec 01, 2023 - ₹2,499</p>
                </div>
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm transition-colors">
                  Pay Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 'methods' && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Your Payment Methods</h3>
              <button className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm transition-colors flex items-center">
                <FiCreditCard className="mr-1.5" /> Add New
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <motion.div 
                  key={method.id}
                  className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    {method.type === 'Credit Card' ? (
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FiCreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FiDollarSign className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm font-medium text-gray-800">{method.type}</p>
                      {method.type === 'Credit Card' ? (
                        <p className="text-xs text-gray-500">Ending in {method.last4} • Expires {method.expiry}</p>
                      ) : (
                        <p className="text-xs text-gray-500">{method.upiId}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {method.default && (
                      <span className="mr-3 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                        <FiCheckCircle className="mr-1" /> Default
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600 ml-2">
                      Edit
                    </button>
                    {!method.default && (
                      <button className="text-gray-400 hover:text-gray-600 ml-2">
                        Remove
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Auto-payment Setting */}
            <motion.div 
              className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center" 
              variants={itemVariants}
            >
              <div>
                <p className="text-sm font-medium text-gray-800">Auto-payment</p>
                <p className="text-xs text-gray-500">Automatically pay your monthly subscription</p>
              </div>
              <label htmlFor="auto-payment-toggle" className="inline-flex items-center cursor-pointer">
                <input id="auto-payment-toggle" type="checkbox" className="sr-only peer" defaultChecked />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="sr-only">Enable auto-payment</span>
              </label>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPayments; 