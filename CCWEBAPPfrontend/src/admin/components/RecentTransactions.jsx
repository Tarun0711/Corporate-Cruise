import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

function RecentTransactions({ transactions = [] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-500 mb-3">
        Recent Transactions
      </h4>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No recent transactions</p>
        ) : (
          transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                {transaction.type === 'credit' ? (
                  <ArrowDownLeft className="text-green-500" size={18} />
                ) : (
                  <ArrowUpRight className="text-red-500" size={18} />
                )}
                <div>
                  <p className="text-gray-700 font-medium">{transaction.description}</p>
                  <p className="text-gray-500 text-sm">{transaction.date}</p>
                </div>
              </div>
              <span className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentTransactions; 