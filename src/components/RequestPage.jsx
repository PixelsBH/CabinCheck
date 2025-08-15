import { useEffect, useState } from "react";

function Requests({ user }) {
  const [Requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://172.16.204.118:5000/routes/meetings/student/${user.username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Requests");
        }
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching Requests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Requests initially
    fetchRequests();

    // Set up polling every 4 seconds
    const interval = setInterval(fetchRequests, 4000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user.username]);

  const handleClick = async (teacherName, username) => {
    console.log(
      "Deleting request for teacher:",
      teacherName,
      "and student:",
      username
    );
    try {
      const response = await fetch(
        `http://172.16.204.118:5000/routes/meetings/${teacherName}/${username}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete request: ${response.statusText}`);
      }
      // Remove deleted request from state
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
    return <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Please wait...
              </p>
              <div className="w-12 h-12 border-4 border-t-transparent border-gray-700 dark:border-gray-200 rounded-full animate-spin">
              </div>
            </div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">
        Requests
      </h1>
      {Requests.length === 0 ? (
        <p className="text-gray-700">No Requests available.</p>
      ) : (
        <ul className="space-y-4">
          {Requests.map((request) => (
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
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <p>
                <strong>Time Allotted:</strong> {request.timeAllotted}
              </p>
              <button
                onClick={() => handleClick(request.teacher, user.username)}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Request
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Requests;
