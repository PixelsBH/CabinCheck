import React from "react";
import PropTypes from "prop-types";

const WelcomeCard = ({ firstName }) => {
  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md border border-gray-200">
      <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
      <h1 className="text-2xl font-bold mt-2">Welcome back, {firstName || "Guest"}!</h1> {/* Display first name */}
    </div>
  );
};

WelcomeCard.propTypes = {
  firstName: PropTypes.string, // Accept firstName as a prop
};

export default WelcomeCard;