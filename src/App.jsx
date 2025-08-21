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
import Loading from "./components/Loading";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { extractRollNo } from "../utils/rollNoUtils";
import { getDepartment } from "../utils/getDepartmentUtils";
import { ToastContainer } from "react-toastify";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarFull, setIsSidebarFull] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme
    ? savedTheme === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });


  // Sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarFull((prev) => !prev);
  };

  // Dark mode toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Auth State Listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const defaultPhotoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          firebaseUser.displayName || "User"
        )}&background=random`;

        setUser({
          photoURL: firebaseUser.photoURL || defaultPhotoURL,
          username: firebaseUser.displayName,
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          rollNo: extractRollNo(firebaseUser.email),
          department: getDepartment(firebaseUser.email),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading isDark={isDark} />;

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
                    <WelcomeCard name={user.username} />
                    <div className="mt-8">
                      <Notifications user={user} />
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
            <Route path="/login" element={<Login setUser={setUser} user={user} isDark={isDark}/>} 
            />
            <Route
              path="*"
              element={<NotFound />}  
            />
          </Routes>
        </main>
      </div>
      <ToastContainer/>
    </BrowserRouter> 
  );
}

export default App;
