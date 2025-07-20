import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Activity, Bell } from "lucide-react";

function Sidebar({ isFull, isMobileOpen, onClose }) {
  const navLinks = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={24} /> },
    { to: "/status", label: "Status Info", icon: <Activity size={24} /> },
    { to: "/requests", label: "Requests", icon: <Bell size={24} /> },
  ];

  const renderLinks = () =>
    navLinks.map(({ to, label, icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center space-x-3 p-2 rounded-lg transition-colors ${
            isActive
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
          }`
        }
      >
        {icon}
        {isFull && <span>{label}</span>}
      </NavLink>
    ));

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden sm:flex bg-white dark:bg-black p-2 sm:p-4 ${
          isFull ? "w-72" : "w-20"
        } min-h-screen border-r border-gray-200 dark:border-gray-700 flex-col transition-all duration-300`}
      >
        <nav className="space-y-4">{renderLinks()}</nav>
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-black w-64 shadow-lg border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 sm:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      > 
        <nav className= "space-y-4 p-4">{renderLinks()}</nav>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-white bg-opacity-50 z-40 sm:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  isFull: PropTypes.bool.isRequired,
  isMobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
