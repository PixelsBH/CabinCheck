import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Activity, Bell } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 p-6 flex flex-col">
      <h1 className="text-white text-2xl font-bold mb-8">Cabin Check</h1>
      <nav className="space-y-4">
        <Link to="/" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </Link>
        <Link to="/status" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
          <Activity size={24} />
          <span>Status Info</span>
        </Link>
        <Link to="/requests" className="flex items-center space-x-3 text-white hover:text-gray-300 p-2 rounded-lg hover:bg-gray-800">
          <Bell size={24} />
          <span>Requests</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;