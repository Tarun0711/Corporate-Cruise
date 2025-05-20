import React from 'react';
import { Send, Clock } from 'lucide-react';

function Outbox({ messages = [] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-500 mb-3">
        Sent Messages
      </h4>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-sm">No sent messages</p>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded-lg">
              <Send className="text-gray-400 mt-1" size={18} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 font-medium">{message.subject}</p>
                  <span className="text-gray-500 text-xs flex items-center">
                    <Clock className="mr-1" size={14} />
                    {message.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Outbox; 