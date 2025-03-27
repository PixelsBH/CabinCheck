import React from 'react';
import PropTypes from 'prop-types';

function Profile({ user }) {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <img
        src={user.profilePic}
        alt={user.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-400">{user.year}</p>
      </div>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired,
  }).isRequired,
};

export default Profile;