import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChevronDown, LayoutDashboard, Activity } from 'lucide-react';
import Profile from "./components/Profile";
import WelcomeCard from "./components/WelcomeCard";
import Notifications from "./components/Notifications";
import ProfilePage from "./components/ProfilePage";
import StatusInfo from "./components/StatusInfo";
import PropTypes from 'prop-types';
import Sidebar from "./components/Sidebar";


const Layout = ({ user, notifications, showDashboard = true, children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-6 flex flex-col">
        <h1 className="text-white text-2xl font-bold mb-8">Cabin Check</h1>
        <nav className="space-y-4">
          <a href="/" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
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
          <div className="flex justify-end">
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-white hover:text-gray-300"
              >
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <span>{user.name}</span>
                <ChevronDown size={20} />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    View Profile
                  </a>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {children || (
            showDashboard ? (
              <>
                <WelcomeCard />
                <div className="mt-8">
                  <Notifications notifications={notifications} />
                </div>
              </>
            ) : (
              <ProfilePage user={user} />
            )
          )}
        </main>
      </div>
    </div>
  );
};

Layout.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired,
  }).isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  showDashboard: PropTypes.bool,
  children: PropTypes.node,
};

function App() {
  const [user] = useState({
    name: "John Doe",
    year: "3rd Year",
    profilePic: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
  });

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} notifications={notifications} showDashboard={true} />} />
        <Route path="/profile" element={<Layout user={user} notifications={notifications} showDashboard={false} />} />
        <Route 
          path="/status" 
          element={
            <Layout user={user} notifications={notifications}>
              <StatusInfo />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;