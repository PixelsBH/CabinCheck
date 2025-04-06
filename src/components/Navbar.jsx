import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, Menu } from "lucide-react";
import { signOut, getAuth } from "firebase/auth";

function Navbar({ user, toggleSidebar }) {
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
    <header className="bg-white p-4 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-black hover:text-gray-600">
          <Menu size={24} />
        </button>
        {/* <h1 className="text-black text-2xl font-bold">Cabin Check</h1> */}
        <img src="/CClogoW.jpg" alt="Logo" className="w-20" />
      </div>
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 text-black hover:text-gray-300 font-bold"
        >
          <img
            src={user?.photoURL || "/default-profile.png"}
            alt={user?.displayName || "User"}
            className="w-10 h-10 rounded-full"
          />
          <span>{user?.displayName || "Guest"}</span>
          <ChevronDown size={20} />
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-400">
            <a href="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-300">
              View Profile
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-300"
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
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;
