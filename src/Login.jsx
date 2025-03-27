import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../config/firebase'; 
import { signInWithPopup } from 'firebase/auth'; 

function Login({ setUser }) { // Added setUser as a prop
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure setUser is a function before calling it
      if (typeof setUser === 'function') {
        setUser({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        });
      } else {
        console.warn("setUser is not a function. User data will not be stored.");
      }

      console.log("Google login successful. Redirecting...");
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="text-center w-11/12 max-w-md">
        <div className="bg-white text-black font-bold text-2xl p-5 rounded-xl mb-6">
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
