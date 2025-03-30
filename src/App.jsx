import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, Activity } from "lucide-react";
import Profile from "./components/Profile";
import WelcomeCard from "./components/WelcomeCard";
import Notifications from "./components/Notification";
import ProfilePage from "./components/ProfilePage";
import StatusInfo from "./components/StatusInfo";
import Login from "./Login";
import PropTypes from "prop-types";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Layout = ({ user, notifications, showDashboard = true, children }) => {
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
                  src={user?.photoURL || "/default-profile.png"}
                  alt={user?.displayName || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <span>{user?.displayName || "Guest"}</span>
                <ChevronDown size={20} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    View Profile
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
          {children || (
            showDashboard ? (
              <>
                <WelcomeCard firstName={user?.displayName?.split(" ")[0]} />
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
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, // Matches the Notification model
      message: PropTypes.string.isRequired, // Matches the Notification model
      date: PropTypes.string, // Matches the Notification model
    })
  ),
  showDashboard: PropTypes.bool,
  children: PropTypes.node,
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/routes/notifications");
        const data = await response.json();
        if (isMounted) {
          setNotifications(data); // Update state only if the component is still mounted
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        if (isMounted) {
          setTimeout(fetchNotifications, 2000); // Schedule the next fetch
        }
      }
    };

    fetchNotifications(); // Initial fetch

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const defaultPhotoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          firebaseUser.displayName || "User"
        )}&background=random`;

        setUser({
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL || defaultPhotoURL,
          email: firebaseUser.email,
          username: firebaseUser.email.split("@")[0],
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Layout user={user} notifications={notifications} showDashboard={true}>
              <WelcomeCard firstName={user.displayName?.split(" ")[0]} />
              <div className="mt-8">
                <Notifications notifications={notifications} />
              </div>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <Layout user={user} notifications={notifications} showDashboard={false} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/status"
        element={
          user ? (
            <Layout user={user} notifications={notifications} showDashboard={false}>
              <StatusInfo user={user} />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={<Login setUser={setUser} />} />
    </Routes>
  );
}

export default App;