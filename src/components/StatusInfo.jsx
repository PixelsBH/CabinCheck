import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { auth } from '../../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function StatusInfo({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [teachers, setTeachers] = useState([]); // State for teachers data
  const [selectedTime, setSelectedTime] = useState("9:00 AM"); // Default time
  const [showPopup, setShowPopup] = useState({ visible: false, professor: null }); // Popup visibility and professor
  const navigate = useNavigate();

  const handleRequestMeeting = (professor) => {
    setShowPopup({ visible: true, professor }); // Pass the professor to the popup state
  };

  const handleConfirmMeeting = async () => {
    setShowPopup({ visible: false, professor: null }); // Hide the popup
    try {
      if (!selectedTime) {
        console.error("Selected time is null or undefined");
        alert("Please select a valid meeting time.");
        return;
      }

      const currentDate = new Date(); // Get the current date
      const match = selectedTime.match(/(\d+):(\d+)\s(AM|PM)/); // Validate selectedTime format
      if (!match) {
        console.error("Invalid time format:", selectedTime);
        alert("Invalid time format. Please select a valid time.");
        return;
      }

      const [_, hour, minute, period] = match; // Extract hour, minute, and period
      let startHour = parseInt(hour);
      if (period === "PM" && startHour !== 12) startHour += 12; // Convert PM to 24-hour format
      if (period === "AM" && startHour === 12) startHour = 0; // Handle midnight

      // Set the time directly in UTC
      currentDate.setUTCHours(startHour, parseInt(minute), 0, 0); // Set hours and minutes in UTC
      console.log("Selected time (UTC):", currentDate.toISOString()); // Debugging log

      const response = await fetch('http://172.16.203.181:5000/routes/meetings', { // Updated URL to match backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher: showPopup.professor, // Use the professor from the popup state
          student: user.username, // Student's username
          date: new Date().toISOString(), // Use the current date in UTC
          status: 'Pending',
          meetTime: currentDate.toISOString(), // Send meetTime as ISO string
        }),
      });

      if (!response.ok) {
        const text = await response.text(); // Read raw response text
        console.error("Server Error:", text); // Log raw response
        throw new Error('Failed to send meeting request');
      }

      const data = await response.json();
      console.log('Meeting request sent:', data);
    } catch (error) {
      console.error('Error sending meeting request:', error);
      alert('Failed to send meeting request.');
    }
  };

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
    let isMounted = true; // Track if the component is still mounted

    const fetchTeachers = async () => {
      try {
        const response = await fetch("http://172.16.203.181:5000/routes/teachers"); // Replace with your IPv4 address
        const data = await response.json();
        if (isMounted) {
          setTeachers(data); // Update state only if the component is still mounted
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        if (isMounted) {
          setTimeout(fetchTeachers, 2000); // Schedule the next fetch
        }
      }
    };

    fetchTeachers(); // Initial fetch

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg border border-gray-300 shadow-md "> {}
        <div className="flex items-center space-x-3 text-white bg-white p-4 rounded-lg"> {}
          <img
            src={firebaseUser?.photoURL || "/default-profile.png"} 
            alt={firebaseUser?.displayName || "User"}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-black">{firebaseUser?.displayName || 'Guest'}</span>
            <span className="text-sm text-gray-600">{firebaseUser?.email || 'No email available'}</span>
          </div>
        </div>
        <div className="relative white p-2 rounded-lg"> {}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 border " size={20} />
          <input
            type="text"
            placeholder="   Search teachers..."
            className="w-72 bg-gray-100 text-gray-700 px-5 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black transition-all placeholder-gray-400 shadow -md hover:shadow-lg transition-shadow duration-300" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher._id} className="bg-gray-30 rounded-lg p-6 space-y-4 border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"> 
            <div className="flex items-center space-x-4">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-black">{teacher.name}</h3>
                <p className="text-gray-600 text-sm">{teacher.email}</p> {/* Display email */}
                <p className="text-gray-600">{teacher.subjects.join(", ")}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-sm font-medium bg-gray-200 px-4 py-1.5 rounded-full text-gray-700">{teacher.office}</span>
              <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                teacher.status 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {teacher.status ? 'In Cabin' : 'Out of Cabin'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusInfo;