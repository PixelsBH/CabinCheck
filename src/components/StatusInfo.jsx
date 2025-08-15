import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { auth } from '../../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function StatusInfo({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [meetingPurpose, setMeetingPurpose] = useState('');
  
  const openPopup = (teacher) => {
    setSelectedTeacher(teacher);
    setMeetingPurpose('');
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedTeacher(null);
    setMeetingPurpose('');
  };

  const handleSendRequest = async () => {
    if (selectedTeacher) {
      await requestMeeting(selectedTeacher._id, selectedTeacher.name, selectedTeacher.email, meetingPurpose);
      closePopup();
    }
  };
  
  const navigate = useNavigate();

  const requestMeeting = async (teacherId, teacherName, teacherEmail, purpose = "Requesting a meeting") => {
    try {
      const response = await fetch("http://172.16.204.118:5000/routes/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher: teacherEmail,
          student: user.username,
          rollNo: user.rollNo,
          purpose: purpose
        }),
      });
      const data = await response.json();

    if (!response.ok) {
      // Show alert for duplicate requests
      if (response.status === 400 && data.message) {
        toast.error(data.message, { position: "bottom-center" });
      } else {
        toast.error(`Failed to create request: ${data.message || response.statusText}`, { position: "bottom-center" });
      }
      return; // Stop further execution
    }
    toast.success("Meeting request sent successfully!", { position: "bottom-center" });
  } catch (error) {
    console.error("Error requesting meeting:", error);
    toast.error("An unexpected error occurred while requesting a meeting.", { position: "bottom-center" });
  }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/Login'); // Redirect to login page if not logged in
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
        const response = await fetch("http://172.16.204.118:5000/routes/teachers");
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
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black p-2 sm:p-6">
      <div className="relative flex items-center space-x-3 mb-6  p-1 rounded-lg"> {}
          <Search className="text-black dark:text-white " size={20} />
          <input
            type="text"
            placeholder="   Search teachers..."
            className="w-72 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 shadow -md hover:shadow-lg" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      {/* Teachers List */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map(teacher => (
          <div key={teacher._id} className="rounded-lg p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"> 
            <div className="flex items-center space-x-4">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">{teacher.name}</h3>
                <p className="text-gray-700 dark:text-gray-400 text-sm">{teacher.email}</p>
                <p className="text-gray-700 dark:text-gray-400">Note: {teacher.note}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-between items-center pt-4 border-t border-gray-800 dark:border-gray-200">
              <span className="text-sm font-medium bg-gray-300 dark:bg-gray-700 px-4 py-1.5 rounded-full text-gray-800 dark:text-gray-200">
                {teacher.office}</span>
              <button className ="px-4 py-1.5 text-sm font-medium bg-sky-300 text-blue-700 rounded-full hover:bg-sky-500 transition-colors duration-300"
                onClick={(() => openPopup(teacher))}>
                  Request
              </button>
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
      {/* Purpose Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-black rounded-lg p-4 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Request Meeting with {selectedTeacher?.name}</h2>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 mb-4 text-black bg-white dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter purpose for meeting..."
              value={meetingPurpose}
              onChange={(e) => setMeetingPurpose(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-300"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-sky-400 text-blue-700 rounded hover:bg-sky-500"
                onClick={handleSendRequest}
                disabled={!meetingPurpose.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StatusInfo;