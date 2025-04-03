import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Info } from 'lucide-react';

function Notifications({ notifications }) {
  useEffect(() => {
    if (notifications.length > 0) {
      console.debug("Notifications received:", notifications); // Use console.debug for less intrusive logging
    }
  }, [notifications]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={notification.id || index} // Use index as fallback if id is undefined
            className="bg-gray-800 rounded-lg p-4 flex items-start space-x-4"
          >
            {notification.type === 'urgent' ? (
              <AlertCircle className="text-red-500" />
            ) : notification.type === 'info' ? (
              <Info className="text-blue-500" />
            ) : (
              <Info className="text-gray-500" /> // Default icon for unknown types
            )}
            <div>
              <h4 className="font-semibold">{notification.title || 'Untitled'}</h4>
              <p className="text-gray-400">{notification.message || 'No message provided.'}</p>
              <span className="text-sm text-gray-500">
                {notification.date
                  ? new Date(notification.date).toLocaleDateString()
                  : 'Unknown date'}
              </span>
              <p className="text-sm text-gray-400">Posted by {notification.teacher || 'Unknown'}</p> {/* Display teacher */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No notifications available.</p>
      )}
    </div>
  );
}

Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, // Matches the Notification model
      message: PropTypes.string.isRequired, // Matches the Notification model
      date: PropTypes.string, // Matches the Notification model
      teacher: PropTypes.string, // Matches the Notification model
    })
  ).isRequired,
};

export default Notifications;