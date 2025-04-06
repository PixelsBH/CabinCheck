import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Info } from 'lucide-react';

function Notifications({ notifications }) {
  useEffect(() => {
    if (notifications.length > 0) {
      console.debug("Notifications received:", notifications); 
    }
  }, [notifications]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={notification.id || index} // Use index as fallback if id is undefined
            className="bg-white rounded-lg p-4 flex border border-gray 300 items-start space-x-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            {notification.type === 'urgent' ? (
              <AlertCircle className="text-red-500" />
            ) : notification.type === 'info' ? (
              <Info className="text-blue-500" />
            ) : (
              <Info className="text-red-500" /> 
            )}
            <div>
              <h4 className="font-semibold text-black">{notification.title || 'Untitled'}</h4>
              <p className="text-gray-600">{notification.message || 'No message provided.'}</p>
              <span className="text-sm text-gray-600">
                {notification.date
                  ? new Date(notification.date).toLocaleDateString()
                  : 'Unknown date'}
              </span>
              <p className="text-sm text-gray-800">Posted by {notification.teacher || 'Unknown'}</p> {/* Display teacher */}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No notifications available.</p>
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