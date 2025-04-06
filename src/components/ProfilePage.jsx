import React from 'react';
import PropTypes from 'prop-types';
import { extractRollNo } from "../../utils/rollNoUtils"; // Import the utility function

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
    <div className="absolute top-0 left-64 right-0 min-h-screen bg-white p-4 p-8 ">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 border border-gray-300 shadow-md rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user?.photoURL || "/default-profile.png"} // Use fallback image
            alt={user?.displayName || "User"}
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-3xl font-bold text-black">{user?.displayName || "Guest"}</h1>
          <div className="w-full mt-8">
            <h2 className="text-xl font-semibold mb-4 text-black">Profile Information</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm text-black">Email</h3>
                <p className="text-black">{user?.email || "No email available"}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm text-black">Roll No.</h3>
                <p className="text-black">{user?.email ? extractRollNo(user.email) : "No roll number available"}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm text-black">Department</h3>
                <p className="text-black">{user?.email ? getDepartment(user.email) : "No department available"}</p>
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