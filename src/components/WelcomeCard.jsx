import PropTypes from "prop-types";

const WelcomeCard = ({ name }) => {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
      <p className="text-sm text-gray-700 dark:text-gray-200">{new Date().toLocaleDateString()}</p>
      <h1 className="text-2xl font-bold mt-2">Welcome back, { name || "Guest"}!</h1> 
    </div>
  );
};

WelcomeCard.propTypes = {
  name: PropTypes.string,
};

export default WelcomeCard;