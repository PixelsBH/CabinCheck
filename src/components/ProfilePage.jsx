import React from 'react';
import PropTypes from 'prop-types';

// Helper function to extract roll number from email
const extractRollNo = (email) => {
  const regex = /^([\w\d]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/i;
  const match = email.match(regex);

  if (!match) return "Invalid Email";

  const year = `20${match[2]}`; // Extract year (e.g., 23 -> 2023)
  const program = match[3].toUpperCase(); // Extract program code and convert to uppercase
  const number = match[4].padStart(4, '0'); // Pad the number to 4 digits

  return `${year}${program}${number}`; // Construct roll number
};

// Helper function to determine department based on email
const getDepartment = (email) => {
  const regex = /^([\w\d]+)(\d{2})(bcs|bec|bcy|bcd)(\d{1,3})@iiitkottayam\.ac\.in$/i;
  const match = email.match(regex);

  if (!match) return "Unknown Department";

  const program = match[3].toLowerCase(); // Extract program code

  switch (program) {
    case "bcs":
      return "Computer Science and Engineering";
    case "bec":
      return "Electronics and Communication Engineering";
    case "bcy":
      return "Computer Science and Engineering with Specialisation in Cyber Security";
    case "bcd":
      return "Computer Science and Engineering with Specialisation in Artificial Intelligence and Data Science";
    default:
      return "Unknown Department";
  }
};

function ProfilePage({ user }) {
  return (
    <div className="absolute top-0 left-64 right-0 min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user?.photoURL || "/default-profile.png"} // Use Firebase user's photoURL
            alt={user?.displayName || "User"} // Use Firebase user's displayName
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-3xl font-bold text-white">{user?.displayName || "Guest"}</h1> {/* Display name */}
          <p className="text-gray-400">{user?.username || "No username available"}</p> {/* Display username */}
          
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Email</h3>
                <p className="text-white">{user?.email || "No email available"}</p> {/* Display email */}
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Roll No.</h3>
                <p className="text-white">{user?.email ? extractRollNo(user.email) : "No roll number available"}</p> {/* Extract roll number */}
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-sm text-gray-400">Department</h3>
                <p className="text-white">{user?.email ? getDepartment(user.email) : "No department available"}</p> {/* Determine department */}
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
    displayName: PropTypes.string,
    email: PropTypes.string,
    username: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default ProfilePage;