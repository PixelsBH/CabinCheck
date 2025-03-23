import React from 'react';
const WelcomeCard = ({ currentDate }) => {
    return (
      <div className="bg-neutral-800 rounded-3xl p-8 mb-8 shadow-lg">
        <p className="text-neutral-400 mb-2">{currentDate}</p>
        <h2 className="text-4xl font-bold mb-2">Welcome back, John!</h2>
        <p className="text-neutral-400">Always stay updated in your student portal</p>
      </div>
    );
  };
  
  export default WelcomeCard;
  