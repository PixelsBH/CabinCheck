import React from "react";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import { auth, provider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { extractRollNo } from "../utils/rollNoUtils";
import { getDepartment } from "../utils/getDepartmentUtils";
import api from "./api"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login({ setUser, user, isDark }) { // Accept user as prop
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = React.useState(false); // Add loading state

  // Add this effect to reset loggingIn if user is authenticated and Login is still rendered
  React.useEffect(() => {
    // If the user is authenticated, this component should not be rendered,
    // but in case it is, reset loggingIn to false
    setLoggingIn(false);
  }, []);

  // Redirect if already logged in
  if (user && !loggingIn) {
    return <Navigate to="/" replace />;
  }

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

      await api.post("http://192.168.56.1:5000/routes/students", {
        name: user.displayName,
        email: user.email,
        firebaseUID: user.uid,
        rollNo,
        department,
      });

      console.log("Google login successful. Redirecting...");
      navigate("/");

    } catch (error) {
      console.error("Firebase login error:", error);

    switch (error.code) {
      case "auth/popup-closed-by-user":
        toast.error("Popup closed before completing sign in.");
        break;
      case "auth/cancelled-popup-request":
        toast.error("Sign in request was cancelled.");
        break;
      case "auth/popup-blocked":
        toast.error("Popup was blocked by your browser. Enable popups and try again.");
        break;
      case "auth/network-request-failed":
        toast.error("Network error. Check your connection.");
        break;
      default:
        toast.error("Login failed. Please try again.");
    }

    setLoggingIn(false); 
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
