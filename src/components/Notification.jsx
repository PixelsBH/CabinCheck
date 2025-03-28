import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Info } from 'lucide-react';

function Notifications({ notifications }) {
  useEffect(() => {
  console.log("Notifications received:", notifications); // Debugging log
  }, [notifications]);
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div
            key={notification.id}
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
              <h4 className="font-semibold">{notification.title}</h4>
              <p className="text-gray-400">{notification.message}</p>
              <span className="text-sm text-gray-500">{notification.time}</span>
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
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Notifications;