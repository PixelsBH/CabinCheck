import React from 'react';
import PropTypes from 'prop-types';

function ProfilePage({ user }) {
  return (
    <div className="absolute top-0 left-64 right-0 min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.year}</p>
          
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Email</h3>
                <p>john.doe@example.com</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Student ID</h3>
                <p>STU123456</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Department</h3>
                <p>Computer Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePage.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    profilePic: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfilePage;