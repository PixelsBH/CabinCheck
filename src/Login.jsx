import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { extractRollNo } from "../utils/rollNoUtils"; // Import extractRollNo

function Login({ setUser }) {
  const navigate = useNavigate();

  const isValidCabinCheckEmail = (email) => {
    const regex = /^([\w\d]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/;
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

      if (typeof setUser === "function") {
        setUser(userData);
      } else {
        console.warn("setUser is not a function. User data will not be stored.");
      }

      // Send user data to the backend to store in MongoDB
      await fetch("http://172.16.203.181:5000/routes/students", { // Replace with your IPv4 address
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
      navigate("/"); // Redirect to dashboard after successful login

    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
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
        <div className="bg-black text-white font-bold text-2xl p-5 rounded-xl mb-6">
          Cabin Check
        </div>
        <p className="text-sm mb-6">
          Cabin Check helps students quickly find professors and check their real-time availability in their cabins, ensuring efficient campus communication.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition"
        >
          <img src="google_icon.png" alt="Google Logo" className="w-5 mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
