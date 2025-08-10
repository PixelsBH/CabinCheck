import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WelcomeCard from "./components/WelcomeCard";
import Notifications from "./components/Notification";
import ProfilePage from "./components/ProfilePage";
import StatusInfo from "./components/StatusInfo";
import Requests from "./components/RequestPage";
import Login from "./Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { extractRollNo } from "../utils/rollNoUtils";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarFull, setIsSidebarFull] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // Sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarFull((prev) => !prev);
  };

  // Dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Fetch Notifications
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://172.16.204.118:5000/routes/notifications");
        const data = await response.json();
        if (isMounted) setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        if (isMounted) setTimeout(fetchNotifications, 2000);
      }
    };

    fetchNotifications();
    return () => { isMounted = false; };
  }, []);

  // Auth State Listener
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
          uid: firebaseUser.uid,
          rollNo: extractRollNo(firebaseUser.email),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;

  return (
    <BrowserRouter>
      {/* Show Navbar + Sidebar only if user is logged in */}
      {user && (
        <Navbar
          user={user}
          toggleSidebar={toggleSidebar}
          toggleDark={() => setIsDark((prev) => !prev)}
          isDark={isDark}
          toggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} 
        />
      )}

      <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
        {user && <Sidebar isFull={isSidebarFull} isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)}/>}

        <main className="flex-1 p-4 sm:p-8 bg-white dark:bg-black">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <>
                    <WelcomeCard name={user.displayName} />
                    <div className="mt-8">
                      <Notifications notifications={notifications} />
                    </div>
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/status"
              element={user ? <StatusInfo user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/requests"
              element={user ? <Requests user={user} /> : <Navigate to="/login" replace />}
            />
            <Route path="/login" element={<Login setUser={setUser} user={user} />} 
            />
            <Route
              path="*"
              element={<NotFound />}  
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
