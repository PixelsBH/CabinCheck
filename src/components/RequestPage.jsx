import React, { useEffect, useState } from "react";

function Requests({ user }) {
  const [Requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://172.16.203.181:5000/routes/meetings/${user.username}`); // Replace with your IPv4 address
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

    // Set up polling every 3 seconds
    const interval = setInterval(fetchRequests, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user.username]);

  const handleClick = async (teacherName, username) => {
    console.log("Frontend - Deleting request for teacher:", teacherName, "and student:", username); // Log the parameters
    try {
      const response = await fetch(`http://172.16.203.181:5000/routes/meetings/${teacherName}/${username}`, { // Replace with your IPv4 address
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete request: ${response.statusText}`);
      }
      // Refetch requests after deletion
      setRequests((prevRequests) =>
        prevRequests.filter((request) => !(request.teacher === teacherName && request.student === username))
      );
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading Requests...</div>;
  }

  // Process requests to get the latest notification for each teacher
  const latestRequests = Object.values(
    Requests.reduce((acc, request) => {
      if (!acc[request.teacher] || new Date(request.date) > new Date(acc[request.teacher].date)) {
        acc[request.teacher] = request; // Keep the most recent request for each teacher
      }
      return acc;
    }, {})
  );

  // Sort the latest requests in descending order based on the date
  latestRequests.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Requests</h1>
      {latestRequests.length === 0 ? (
        <p className="text-gray-400">No Requests available.</p>
      ) : (
        <ul className="space-y-4">
          {latestRequests.map((request) => (
            <li key={request._id} className="bg-gray-800 p-4 rounded-lg text-white">
              <p><strong>Teacher:</strong> {request.teacher}</p>
              <p><strong>Date:</strong> {new Date(request.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
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