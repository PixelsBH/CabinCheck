import { useEffect, useState } from "react";
import api from "../api"; 

function Requests({ user }) {
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get(`/meetings/student/${user.username}`);
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initially
    fetchRequests();

    // Poll every 4s
    const interval = setInterval(fetchRequests, 4000);

    return () => clearInterval(interval);
  }, [user.username]);

  const handleClick = async (teacherName, username) => {
    try {
      await api.delete(`/meetings/${teacherName}/${username}`);
      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            !(request.teacher === teacherName && request.student === username)
        )
      );
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Please wait...
        </p>
        <div className="w-12 h-12 border-4 border-t-transparent border-gray-700 dark:border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Requests
      </h1>
      {requests.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-400">No Requests available.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li
              key={request._id}
              className="bg-gray-200 dark:bg-gray-900 p-4 rounded-lg text-black dark:text-white border border-gray-300 dark:border-gray-800 shadow-md"
            >
              <p>
                <strong>Teacher:</strong> {request.teacher}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(request.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Purpose:</strong> {request.purpose}
              </p>
              <div className="flex justify-between items-center mt-2 gap-4 flex-wrap">
                <button
                  onClick={() => handleClick(request.teacher, user.username)}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex-shrink-0"
                >
                  Delete Request
                </button>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium text-center flex-shrink-0 ${
                    request.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : request.status === "Rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <p>
                    <strong>Status:</strong> {request.status}
                  </p>
                </div>
                <p className="px-4 py-2 rounded-full text-sm font-medium text-center flex-shrink-0 bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                  <strong>Time Allotted:</strong>{" "}
                  {request.timeAllotted || "N/A"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Requests;
