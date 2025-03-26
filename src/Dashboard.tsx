import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Bell, LogOut, User } from 'lucide-react';
import axios from "axios";

interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null; // Allow null for cases where no photo is available
}

function Dashboard() {
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]); // Ensure teachers is an array
  const [loading, setLoading] = useState(true); // Add a loading state

  const notifications = [
    {
      id: 1,
      title: "Assignment Due",
      message: "Your Advanced Mathematics assignment is due tomorrow",
      time: "2 hours ago",
      type: "urgent"
    },
    {
      id: 2,
      title: "Grade Posted",
      message: "New grade posted for Computer Science",
      time: "5 hours ago",
      type: "info"
    },
    {
      id: 3,
      title: "Event Reminder",
      message: "Student Council meeting tomorrow at 3 PM",
      time: "1 day ago",
      type: "info"
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    try {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("/api/teachers");
        if (Array.isArray(response.data)) {
          setTeachers(response.data); // Ensure the response is an array
        } else {
          console.error("Unexpected API response:", response.data);
          setTeachers([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setTeachers([]); // Fallback to an empty array
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchTeachers();
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && !target.closest('.profile-menu')) {
      setShowProfileMenu(false);
    }
  };

  const getUserInitials = (name: string): string => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase(); // Handle single-word names
    }
    return `${nameParts[0][0] || ''}${nameParts[1][0] || ''}`.toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-black text-white" onClick={handleClickOutside}>
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-800 rounded-r-3xl p-6 flex flex-col">
        {/* Logo */}
        <div className="bg-white text-black rounded-xl p-3 inline-block mb-8">
          <h1 className="font-bold text-xl">Cabin Check</h1>
        </div>

        {/* Dashboard Button */}
        <button className="flex items-center gap-2 bg-white/10 text-white rounded-xl p-4 hover:bg-white/20 transition-colors">
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </button>

        {/* Status Info */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">STATUS INFO</h2>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Profile */}
        <div className="flex justify-end mb-8 relative profile-menu">
          <div 
            className="flex items-center bg-neutral-800 rounded-full p-2 pr-4 gap-3 cursor-pointer hover:bg-neutral-700 transition-colors"
            onClick={handleProfileClick}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold">
                {user?.displayName ? getUserInitials(user.displayName) : 'G'}
              </div>
            )}
            <div>
              <h3 className="font-medium">{user?.displayName || "Guest"}</h3>
              <p className="text-sm text-neutral-400">{user?.email || "No email"}</p>
            </div>
          </div>

          {/* Profile Dropdown Menu */}
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

        <div className="flex gap-8">
          {/* Welcome Card */}
          <div className="flex-1">
            <div className="bg-neutral-800 rounded-3xl p-8 mb-8 shadow-lg">
              <p className="text-neutral-400 mb-2">{currentDate}</p>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.displayName || "Guest"}!
                  </h2>
                  <p className="text-neutral-400">Always stay updated in your student portal</p>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300"
                    alt="Student Avatar"
                    className="rounded-2xl shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vertical Line */}
          <div className="w-px bg-white/20"></div>

          {/* Notifications */}
          <div className="w-96">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">NOTIFICATIONS</h2>
                <Bell size={20} className="text-neutral-400" />
              </div>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.length} new
              </span>
            </div>
            
            <div className="space-y-4">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className="bg-neutral-800 rounded-xl p-4 hover:bg-neutral-700 transition-colors cursor-pointer shadow-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.type === 'urgent' 
                        ? 'bg-red-400/20 text-red-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm mb-2">{notification.message}</p>
                  <p className="text-xs text-neutral-500">{notification.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Teachers</h2>
          {loading ? (
            <p>Loading teachers...</p>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher: any) => (
                <div key={teacher._id} className="bg-neutral-800 rounded-xl p-4 shadow-md">
                  <h3 className="font-medium">{teacher.name || "N/A"}</h3>
                  <p className="text-neutral-400">Email: {teacher.email || "N/A"}</p>
                  <p className="text-neutral-400">Status: {teacher.status || "N/A"}</p>
                  <p className="text-neutral-400">Schedule: {teacher.schedule?.length || 0} events</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
