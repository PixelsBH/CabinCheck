import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADk5nY6Bnxh0hbAAhvSnM0tIFS5h16cdI",
  authDomain: "login-8cb26.firebaseapp.com",
  projectId: "login-8cb26",
  storageBucket: "login-8cb26.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "179904000591",
  appId: "1:179904000591:web:f4d8e180016de014ed303a",
  measurementId: "G-091J46373K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
auth.languageCode = "en";

const provider = new GoogleAuthProvider();

export { auth, provider };
