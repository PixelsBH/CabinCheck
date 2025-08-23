import { useEffect, useState } from 'react';
import { Pin } from "lucide-react";
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import api from '../api';

const socket = io("http://192.168.56.1:5000");

export default function TeacherCard({ teacher, userId, openPopup }) {
  const [status, setStatus] = useState(teacher.status || false);
  const [isPinned, setIsPinned] = useState(teacher.isPinned || false);
  useEffect(() => {
    // Listen to status updates
    const handleStatusUpdate = ({ email, status }) => {
      if (email === teacher.email) setStatus(status);
    };

    // Listen to pin/unpin updates from server
    const handlePinUpdate = ({ studentId, teacherEmail, pinned }) => {
      if (studentId === userId && teacherEmail === teacher.email) {
        setIsPinned(pinned);
      }
    };

    socket.on("teacherStatusUpdate", handleStatusUpdate);
    socket.on("pinUpdate", handlePinUpdate);

    return () => {
      socket.off("teacherStatusUpdate", handleStatusUpdate);
      socket.off("pinUpdate", handlePinUpdate);
    };
  }, [teacher.email, userId]);

  const togglePin = async () => {
    try {
      const response = await api.patch(`/students/pin/${teacher.email}`);
      toast.success(response.data.message, { position: "bottom-center" });
      setIsPinned(prev => !prev);
      socket.emit("pinUpdate", { studentId: userId, teacherEmail: teacher.email });
    } catch (err) {
      console.error("Error pinning/unpinning:", err);
      toast.error("Failed to update pin status", { position: "bottom-center" });
    }
  };
  return (
    <div className="relative rounded-lg p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Pin button top-right */}
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => togglePin(teacher.email)}
      >
        <Pin
          size={18}
          className={teacher.isPinned ? "text-blue-500" : "text-gray-400"}
        />
      </button>

      <div className="flex items-center space-x-4">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="w-16 h-16 rounded-full"
          loading="lazy"
        />
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {teacher.name}
          </h3>
          <p className="text-gray-700 dark:text-gray-400 text-sm">{teacher.email}</p>
          <p className="text-gray-700 dark:text-gray-400">Note: {teacher.note}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center pt-4 border-t border-gray-800 dark:border-gray-200">
        <span className="text-sm font-medium bg-gray-300 dark:bg-gray-700 px-4 py-1.5 rounded-full text-gray-800 dark:text-gray-200">
          {teacher.office}
        </span>
        <button
          className="px-4 py-1.5 text-sm font-medium bg-sky-300 text-blue-700 rounded-full hover:bg-sky-500 transition-colors duration-300"
          onClick={() => openPopup(teacher)}
        >
          Request
        </button>
        <div
          className={`px-4 py-1.5 rounded-full text-sm font-medium ${
            teacher.status
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {teacher.status ? 'In Cabin' : 'Out of Cabin'}
        </div>
      </div>
    </div>
  );
}
