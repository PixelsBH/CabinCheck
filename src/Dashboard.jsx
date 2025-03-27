import React, { useState, useEffect } from 'react';
import { ChevronDown, LayoutDashboard, Activity } from 'lucide-react';
import PropTypes from 'prop-types';
import { auth } from '../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = ({ user }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login page if not logged in
      } else {
        setFirebaseUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const notifications = [
    {
      id: 1,
      title: "Assignment Due",
      message: "Your Advanced Mathematics assignment is due tomorrow",
      time: "2 hours ago",
      type: "urgent",
    },
    {
      id: 2,
      title: "Grade Posted",
      message: "New grade posted for Computer Science",
      time: "5 hours ago",
      type: "info",
    },
    {
      id: 3,
      title: "Event Reminder",
      message: "Student Council meeting tomorrow at 3 PM",
      time: "1 day ago",
      type: "info",
    },
  ];

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('user');
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 flex flex-col">
        <h1 className="text-white text-2xl font-bold mb-8">Cabin Check</h1>
        <nav className="space-y-4">
          <a href="/dashboard" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
            <LayoutDashboard size={24} />
            <span>Dashboard</span>
          </a>
          <a href="/status" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
            <Activity size={24} />
            <span>Status Info</span>
          </a>
        </nav>
      </div>

      <div className="flex-1">
        {/* Header */}
        <header className="bg-gray-900 px-6 py-4">
          <div className="flex justify-end items-center space-x-4">
            {firebaseUser && (
              <div className="flex items-center space-x-3 text-white">
                {firebaseUser?.photoURL ? (
                  <img
                    src={firebaseUser.photoURL}
                    alt={firebaseUser.displayName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                    {firebaseUser?.displayName?.[0]?.toUpperCase() || 'G'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold">{firebaseUser?.displayName || 'Guest'}</span>
                  <span className="text-sm text-gray-400">{firebaseUser?.email || 'No email available'}</span>
                </div>
              </div>
            )}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-white hover:text-gray-300"
              >
                <ChevronDown size={20} />
              </button>
    
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          <h1 className="text-white text-3xl font-bold">Welcome, {firebaseUser?.displayName || 'Guest'}!</h1>
          <div className="mt-6">
            <h2 className="text-white text-2xl font-bold">Notifications</h2>
            <ul className="mt-4 space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-bold">{notification.title}</h3>
                  <p className="text-gray-400">{notification.message}</p>
                  <span className="text-gray-500 text-sm">{notification.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Dashboard;
