import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { signOut, getAuth } from "firebase/auth";
import { NavLink } from "react-router-dom";

function Navbar({ user, toggleSidebar, toggleDark, isDark, toggleMobileSidebar }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-black p-2 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
      {/* Left side with logo and sidebar toggle */}
      <div className="flex items-center space-x-4">
        {/* Mobile Sidebar Toggle (hamburger) */}
        <button
          onClick={toggleMobileSidebar}
          className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 sm:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden sm:block text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Menu size={24} />
        </button>

        {/* Switch logo based on theme */}
        <img
          src={isDark ? "/CClogoB.jpg" : "/CClogoW.jpg"}
          alt="Logo"
          className="w-16 sm:w-20"
        />
      </div>

      {/* Right side with dark mode toggle and profile */}
      <div className="flex items-center space-x-4 sm:space-x-6 relative">
        {/* Dark Mode Toggle Icon */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-full bg-white dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-black" />}
        </button>

        {/* Profile Menu */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 text-black dark:text-white font-bold"
        >
          <img
            src={user?.photoURL || "/default-profile.png"}
            alt={user?.displayName || "User"}
            className="w-10 h-10 rounded-full"
          />
          <span className="hidden md:inline">{user?.displayName || "Guest"}</span>
          <ChevronDown size={20} />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-12 w-48 bg-white dark:bg-black rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-800">
            <NavLink
              to="/profile"
              className="block px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => setShowProfileMenu(false)}
            >
              View Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  user: PropTypes.shape({
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
  toggleSidebar: PropTypes.func.isRequired,       // Desktop sidebar toggle
  toggleDark: PropTypes.func.isRequired,
  isDark: PropTypes.bool.isRequired,
  toggleMobileSidebar: PropTypes.func.isRequired, // NEW: Mobile sidebar toggle
};

export default Navbar;
