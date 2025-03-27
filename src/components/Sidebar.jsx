import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Bell, Settings } from 'lucide-react';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 p-6">
      <div className="space-y-6">
        <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-300">
          <Home size={24} />
          <span>Dashboard</span>
        </Link>
        <Link to="/profile" className="flex items-center space-x-3 text-white hover:text-gray-300">
          <User size={24} />
          <span>Profile</span>
        </Link>
        <div className="flex items-center space-x-3 text-white hover:text-gray-300 cursor-pointer">
          <Bell size={24} />
          <span>Notifications</span>
        </div>
        <div className="flex items-center space-x-3 text-white hover:text-gray-300 cursor-pointer">
          <Settings size={24} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;