import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, Info } from 'lucide-react';

function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const pollingTimeout = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchNotifications = async () => {
      if (!user || !user.rollNo) return;
      try {
        const url = `http://172.16.204.118:5000/routes/notifications/roll/${encodeURIComponent(
          user.rollNo
        )}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (isMounted.current) setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        // schedule next poll only if still mounted
        if (isMounted.current) pollingTimeout.current = setTimeout(fetchNotifications, 5000);
      }
    };

    fetchNotifications();

    return () => {
      isMounted.current = false;
      if (pollingTimeout.current) clearTimeout(pollingTimeout.current);
    };
  }, [user]);

  useEffect(() => {
    if (notifications.length > 0) {
      console.debug('Notifications received:', notifications);
    }
  }, [notifications]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recent Notifications</h3>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={notification._id || notification.id || index}
            className="bg-white dark:bg-black rounded-lg p-4 flex flex-row border border-gray-200 dark:border-gray-800 items-start space-x-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            {notification.type === 'urgent' ? (
              <AlertCircle className="text-red-500" />
            ) : notification.type === 'info' ? (
              <Info className="text-blue-500" />
            ) : (
              <Info className="text-red-500" />
            )}
            <div>
              <h4 className="font-semibold text-black dark:text-white">{notification.title || 'Untitled'}</h4>
              <p className="text-gray-700 dark:text-gray-300">{notification.message || 'No message provided.'}</p>
              <span className="text-sm text-gray-700 dark:text-gray-300">Posted on: {notification.date ? new Date(notification.date).toLocaleDateString() : 'Unknown date'}
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300">Posted by {notification.teacher || 'Unknown'}</p>
            </div>
            <div className="flex-1 ml-auto text-right">
              <h4 className="">Year: {notification.years || 'All'}</h4>
              {(() => {
                const deps = Array.isArray(notification.departments) ? notification.departments : [];
                const cleaned = deps.map((d) => String(d).trim()).filter(Boolean);
                const display = cleaned.length === 0 ? 'General' : cleaned.includes('ALL') ? 'All' : cleaned.join(', ');
                return <h4 className="">Department: {display}</h4>;
              })()}
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
  user: PropTypes.shape({
    rollNo: PropTypes.string,
  }),
};

export default Notifications;