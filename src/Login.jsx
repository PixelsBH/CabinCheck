import React from "react";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import { auth, provider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { extractRollNo } from "../utils/rollNoUtils";
import { getDepartment } from "../utils/getDepartmentUtils";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ setUser, user, isDark }) { // Accept user as prop
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = React.useState(false); // Add loading state

  // Redirect if already logged in
  if (user && !loggingIn) {
    return <Navigate to="/" replace />;
  }

  // Add this effect to reset loggingIn if user is authenticated and Login is still rendered
  React.useEffect(() => {
    // If the user is authenticated, this component should not be rendered,
    // but in case it is, reset loggingIn to false
    setLoggingIn(false);
  }, []);

  const isValidCabinCheckEmail = (email) => {
    const regex = /^([a-zA-Z]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/;
    const match = email.match(regex);

    if (!match) return false;

    let username = match[1]; // Extracted username
    let year = parseInt(match[2]); // Admission Year 
    let program = match[3]; // Program Code (bcs, bec, bcy, bcd)
    let number = parseInt(match[4]); // Unique student number

    if (!username) return false; // Ensure username exists

    // Check number ranges based on the program
    if (program === "bcs" && (number < 0 || number > 240)) return false;
    if (["bec", "bcy", "bcd"].includes(program) && (number < 0 || number > 60)) return false;

    return username; // Return the extracted username
  };

  const handleGoogleLogin = async () => {
    try {
      setLoggingIn(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;

      // Validate email format
      if (!email.endsWith("@iiitkottayam.ac.in")) {
        toast.error("Please use your IIIT Kottayam email.", { position: "bottom-center" });
        await signOut(auth);
        setLoggingIn(false);
        return;
      }

      // Validate email according to Cabin Check rules
      const username = isValidCabinCheckEmail(email);
      if (!username) {
        toast.error("Invalid email format. Only valid B.Tech students can log in.", { position: "bottom-center" });
        await signOut(auth);
        setLoggingIn(false);
        return;
      }

      // Compute roll number using extractRollNo
      const rollNo = extractRollNo(email);
      if (rollNo === "Invalid Email") {
        toast.error("Invalid email format. Unable to compute roll number.", { position: "bottom-center" });
        await signOut(auth);
        setLoggingIn(false);
        return;
      }
      const department = getDepartment(email);
      if (department === "Unknown Department") {
        toast.error("Invalid email format. Unable to determine department.", { position: "bottom-center" });
        await signOut(auth);
        setLoggingIn(false);
        return;
      }

      await fetch("http://172.16.204.118:5000/routes/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          firebaseUID: user.uid,
          rollNo: rollNo,
          department: department,
        }),
      });

      console.log("Google login successful. Redirecting...");
      window.location.replace("/"); // Force reload and go to Dashboard

    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again.", { position: "bottom-center" });
      setLoggingIn(false); // Stop loading on error
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="text-center w-11/12 max-w-md">
        <NavLink to="/">
          <img src={isDark? "CClogoB.jpg": "CClogoW.jpg"} alt="Logo" className="w-48 mx-auto mb-4" />
        </NavLink>
        <p className="text-sm mb-6">
          Cabin Check helps students quickly find professors and check their real-time availability in their cabins, ensuring efficient campus communication.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
          disabled={loggingIn}
        >
          <img src="/google_icon.png" alt="Google Logo" className="w-5 mr-2" />
          {loggingIn ? "Signing in..." : "Continue with Google"}
        </button>
        {loggingIn && (
          <div className="mt-4 text-gray-500">Signing in, please wait...</div>
        )}
      </div>
    </div>
  );
}

export default Login;
