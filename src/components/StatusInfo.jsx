import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { auth } from '../../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
//import axios from 'axios'; // Import axios for API requests
//import Meeting from './Meeting'; // Import Meeting component

function StatusInfo({user}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [teachers, setTeachers] = useState([]); // State for teachers data
  const navigate = useNavigate();

  // const handleClick = async (username, professor) => {
  //   try {
  //     const response = await axios.post('/api/meetings', {
  //       student: username,
  //       professor: professor
  //     });
  //     console.log('Meeting request sent:', response.data);
  //     alert('Meeting request sent successfully!');
  //   } catch (error) {
  //     console.error('Error sending meeting request:', error);
  //     alert('Failed to send meeting request.');
  //   }
  // };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login page if not logged in
      } else {
        setFirebaseUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teachers");
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
      const interval = setInterval(fetchTeachers, 50);
      return () => clearInterval(interval); // Cleanup on unmount
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3 text-white">
          <img
            src={firebaseUser?.photoURL || "/default-profile.png"} // Use fallback image
            alt={firebaseUser?.displayName || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold">{firebaseUser?.displayName || 'Guest'}</span>
            <span className="text-sm text-gray-400">{firebaseUser?.email || 'No email available'}</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search teachers..."
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher._id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                <p className="text-gray-400 text-sm">{teacher.email}</p> {/* Display email */}
                <p className="text-gray-400">{teacher.subjects.join(", ")}</p>
              </div>
            </div>
            {/* <div className="flex justify-between items-center pt-4 border-t border-gray-700">
      <span className="text-gray-300">{teacher.office}</span>
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm mx-2"
        onClick={() => handleClick(user.username, teacher.name)}
      >
        Request Meeting
      </button>
      <span className={`px-3 py-1 rounded-full text-sm ${
        teacher.status 
          ? 'bg-green-900 text-green-300' 
          : 'bg-red-900 text-red-300'
      }`}>
        {teacher.status ? 'Available' : 'Unavailable'}
      </span>
    </div> */}

            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-300">{teacher.office}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                teacher.status 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {teacher.status ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusInfo;