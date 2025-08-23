import { useEffect, useState } from 'react';
import { Search, Pin } from 'lucide-react';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { io } from 'socket.io-client';
import TeacherCard from './TeacherCard';

// Connect to your backend Socket.IO server
const socket = io("http://192.168.56.1:5000");

function StatusInfo({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [teachers, setTeachers] = useState([]); //pinned Teachers
  const [searchedTeachers, setSearchedTeachers] = useState([]); // search results
  const [showPopup, setShowPopup] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [meetingPurpose, setMeetingPurpose] = useState('');
  const [allTeachers, setAllTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();

  // Popup handlers

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
      await requestMeeting(selectedTeacher.name, meetingPurpose);
      closePopup();
    }
  };

  const requestMeeting = async (teacherEmail, purpose = "Requesting a meeting") => {
    try {
      const response = await api.post("/meetings", {
        teacher: teacherEmail,
        student: user.username,
        rollNo: user.rollNo,
        purpose: purpose,
      });

      toast.success("Meeting request sent successfully!", { position: "bottom-center" });
      return response.data;
    } catch (error) {
      console.error("Error requesting meeting:", error);
      if (error.response?.status === 400 && error.response?.data?.message) {
        toast.error(error.response.data.message, { position: "bottom-center" });
      } else {
        toast.error("Failed to create request.", { position: "bottom-center" });
      }
    }
  };

  //Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/Login');
      } else {
        setFirebaseUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch searched teachers when searchTerm changes
  useEffect(() => {
    const fetchSearchedTeachers = async () => {
      if (!searchTerm.trim()) {
        setSearchedTeachers([]);
        return;
      }
      try {
        const res = await api.get(`/teachers/search?query=${encodeURIComponent(searchTerm)}`);
        setSearchedTeachers(res.data);
      } catch (err) {
        console.error("Error fetching searched teachers:", err);
      }
    };
    fetchSearchedTeachers();
  }, [searchTerm]);

  // Fetch pinned teachers
  useEffect(() => {
    let isMounted = true;

    const fetchPinnedTeachers = async () => {
      try {
        const res = await api.get(`/students/${user.uid}/pinned`);
        setTeachers(res.data);
      } catch (err) {
        console.error("Error fetching pinned teachers:", err);
      }
      finally {
        if (isMounted) {
          setTimeout(fetchPinnedTeachers, 4000);
        }
      }
    };
    fetchPinnedTeachers();
    return () => { isMounted = false; };
  }, [user.uid]);

  const fetchAllTeachers = async (pageNum = 1) => {
  try {
    const res = await api.get(`/teachers/all?page=${pageNum}&limit=20`);
    setAllTeachers(prev => [...prev, ...res.data.teachers]);
    setHasMore(pageNum < res.data.totalPages);
  } catch (err) {
    console.error("Error fetching all teachers:", err);
  }
};

// Load first page when button clicked
const handleShowAll = () => {
  setShowAll(true);
  fetchAllTeachers(1);
};

// Infinite scroll
useEffect(() => {
  if (!showAll || !hasMore) return;

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      fetchAllTeachers(page + 1);
      setPage(prev => prev + 1);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
  }, [showAll, page, hasMore]);

  return (
    <div className="min-h-screen bg-white dark:bg-black p-2 sm:p-6">

      {/* Search bar */}
      <div className="relative flex items-center space-x-3 mb-6 p-1 rounded-lg">
        <Search className="text-black dark:text-white" size={20} />
        <input
          type="text"
          placeholder="   Search teachers..."
          className="w-72 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-black placeholder-gray-400 shadow-md hover:shadow-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results */}
      {searchTerm.trim() && (
        <div className="mb-10">
          <h1 className="text-xl font-bold text-black dark:text-white mb-4">Search Results</h1>
          {searchedTeachers.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-400">No teachers found</p>
          ) : (
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
              {searchedTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher._id}
                  teacher={teacher}
                  userId={user.uid}
                  openPopup={openPopup}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pinned Teachers */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Pinned Teachers</h1>
        {teachers.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-400">No pinned teachers</p>
        ) : (
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher._id}
                teacher={teacher}
                userId={user.uid}
                openPopup={openPopup}
              />
            ))}
          </div>
        )}
      </div>

      {/* Show All Teachers Button */}
      {!showAll && (
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            onClick={handleShowAll}
          >
            Show All Teachers
          </button>
        </div>
      )}

      {/* All Teachers */}
      {showAll && (
        <div className="mt-6">
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">All Teachers</h1>
          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
            {allTeachers.map((teacher) => (
              <TeacherCard
                key={teacher._id}
                teacher={teacher}
                userId={user.uid}
                openPopup={openPopup}
              />
            ))}
          </div>
          {!hasMore && (
            <p className="text-center mt-4 text-gray-500">No more teachers</p>
          )}
        </div>
      )}

      {/* Purpose Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-black rounded-lg p-4 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Request Meeting with {selectedTeacher?.name}
            </h2>
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
