import React from "react";
import PropTypes from "prop-types";

const WelcomeCard = ({ firstName }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p>
      <h1 className="text-2xl font-bold mt-2">Welcome back, {firstName || "Guest"}!</h1> {/* Display first name */}
    </div>
  );
};

WelcomeCard.propTypes = {
  firstName: PropTypes.string, // Accept firstName as a prop
};

export default WelcomeCard;