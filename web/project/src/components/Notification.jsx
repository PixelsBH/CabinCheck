import React from 'react';
import NotificationItem from './NotificationItem';
import { Bell } from 'lucide-react';

const Notifications = ({ notifications }) => {
  return (
    <div className="w-96">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">NOTIFICATIONS</h2>
          <Bell size={20} className="text-neutral-400" />
        </div>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {notifications.length} new
        </span>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
