import React from 'react';
import { useState } from 'react';
import { User, LogOut } from 'lucide-react';

const Profile = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <div className="relative profile-menu">
      <div 
        className="flex items-center bg-neutral-800 rounded-full p-2 pr-4 gap-3 cursor-pointer hover:bg-neutral-700 transition-colors"
        onClick={handleProfileClick}
      >
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">John Doe</h3>
          <p className="text-sm text-neutral-400">3rd year</p>
        </div>
      </div>

      {showProfileMenu && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-800 rounded-xl shadow-lg py-2 z-10 border border-neutral-700">
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full text-left transition-colors">
            <User size={16} />
            <span>View Profile</span>
          </button>
          <div className="h-px bg-neutral-700 my-1"></div>
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700 w-full text-left text-red-400 transition-colors">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
