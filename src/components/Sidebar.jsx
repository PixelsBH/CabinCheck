import React from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Activity, Bell } from "lucide-react";

function Sidebar({ isFull }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`bg-white p-4 ${isFull ? "w-72" : "w-20"} min-h-screen border-r border-gray-200 flex flex-col transition-all duration-300`}
    >
      <nav className="space-y-4">
        <Link
          to="/"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive("/") ? "bg-black text-white" : "text-black hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <LayoutDashboard size={24} />
          {isFull && <span>Dashboard</span>}
        </Link>
        <Link
          to="/status"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive("/status") ? "bg-black text-white" : "text-black hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Activity size={24} />
          {isFull && <span>Status Info</span>}
        </Link>
        {/* <Link
          to="/requests"
          className={`flex items-center space-x-3 p-2 rounded-lg ${
            isActive("/requests") ? "bg-black text-white" : "text-black hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <Bell size={24} />
          {isFull && <span>Requests</span>}
        </Link> */}
      </nav>
    </div>
  );
}

Sidebar.propTypes = {
  isFull: PropTypes.bool.isRequired,
};

export default Sidebar;