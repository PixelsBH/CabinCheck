import React from 'react';
const NotificationItem = ({ title, message, time, type }) => {
    return (
      <div className="bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 transition-colors cursor-pointer shadow-md">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            type === 'urgent' ? 'bg-red-400/20 text-red-400' : 'bg-blue-400/20 text-blue-400'
          }`}>
            {type}
          </span>
        </div>
        <p className="text-neutral-400 text-sm mb-2">{message}</p>
        <p className="text-xs text-neutral-500">{time}</p>
      </div>
    );
  };
  
  export default NotificationItem;
  