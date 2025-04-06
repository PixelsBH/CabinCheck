import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import WelcomeCard from "./components/WelcomeCard";
import Notifications from "./components/Notification";
import ProfilePage from "./components/ProfilePage";
import StatusInfo from "./components/StatusInfo";
// import Requests from "./components/RequestPage"; // Commented out Requests import
import Login from "./Login";
import Sidebar from "./components/Sidebar"; // Import Sidebar component
import Navbar from "./components/Navbar"; // Import Navbar component
import PropTypes from "prop-types";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Layout = ({ user, notifications, showDashboard = true, children }) => {
  const [isSidebarFull, setIsSidebarFull] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarFull((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to Navbar */}
      <div className="flex">
        <Sidebar isFull={isSidebarFull} /> {/* Pass isFull to Sidebar */}
        <main className="flex-1 p-8 bg-white min-h-screen">
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
        const response = await fetch("http://172.16.203.181:5000/routes/notifications"); // Replace with your IPv4 address
        const data = await response.json();
        if (isMounted) {
          setNotifications(data); // Ensure teacher field is part of the fetched data
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
      {/* <Route
        path="/requests"
        element={
          user ? (
            <Layout user={user} showDashboard={false}>
              <Requests user={user} />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      /> */}
      <Route path="/login" element={<Login setUser={setUser} />} />
    </Routes>
  );
}

export default App;