import React from "react";
import { useNavigate, NavLink, Navigate } from "react-router-dom";
import { auth, provider } from "../config/firebase";
import { signInWithPopup, signInWithRedirect, signOut } from "firebase/auth"; // Import signInWithRedirect
import { extractRollNo } from "../utils/rollNoUtils"; // Import extractRollNo

function Login({ setUser, user }) { // Accept user as prop
  const navigate = useNavigate();
  const [loggingIn, setLoggingIn] = React.useState(false); // Add loading state

  // Redirect if already logged in
  if (user) {
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
    let year = parseInt(match[2]); // Admission Year (21, 22, 23, 24)
    let program = match[3]; // Program Code (bcs, bec, bcy, bcd)
    let number = parseInt(match[4]); // Unique student number

    if (!username) return false; // Ensure username exists

    // Ensure year is between 21 and 24 (valid B.Tech batches)
    if (![21, 22, 23, 24].includes(year)) return false;

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
        alert("Please use your IIIT Kottayam email.");
        await signOut(auth);
        return;
      }

      // Validate email according to Cabin Check rules
      const username = isValidCabinCheckEmail(email);
      if (!username) {
        alert("Invalid email format. Only valid B.Tech students can log in.");
        await signOut(auth);
        return;
      }

      // Compute roll number using extractRollNo
      const rollNo = extractRollNo(email);
      if (rollNo === "Invalid Email") {
        alert("Invalid email format. Unable to compute roll number.");
        await signOut(auth);
        return;
      }

      // Store user info
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        username: username,
        rollNo: rollNo,
        photoURL: user.photoURL,
      };
      await fetch("http://192.168.29.125:5000/routes/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          firebaseUID: user.uid,
          rollNo: rollNo,
        }),
      });

      console.log("Google login successful. Redirecting...");
      window.location.replace("/"); // Force reload and go to Dashboard

    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
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
    <div className="flex justify-center items-center min-h-screen bg-white text-black">
      <div className="text-center w-11/12 max-w-md">
        <NavLink to="/">
          <img src="CClogoW.jpg" alt="Logo" className="w-48 mx-auto mb-4" />
        </NavLink>
        <p className="text-sm mb-6">
          Cabin Check helps students quickly find professors and check their real-time availability in their cabins, ensuring efficient campus communication.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
          disabled={loggingIn}
        >
          <img src="google_icon.png" alt="Google Logo" className="w-5 mr-2" />
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
