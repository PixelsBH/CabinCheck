import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import Dashboard from "./Dashboard";
import StatusInfo from "./components/StatusInfo";
import Login from "./Login";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [user, setUser] = useState(null); // Initialize user as null

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Login setUser={setUser} />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
      />
      <Route
        path="/status"
        element={user ? <StatusInfo user={user} /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={user ? <ProfilePage user={user} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
