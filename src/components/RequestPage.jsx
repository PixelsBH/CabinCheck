import React, { useEffect, useState } from "react";

function Requests({ user }) {
  const [Requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5000/routes/meetings/${user.username}`);
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

  if (loading) {
    return <div className="text-white">Loading Requests...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Requests</h1>
      {Requests.length === 0 ? (
        <p className="text-gray-400">No Requests available.</p>
      ) : (
        <ul className="space-y-4">
          {Requests.map((request) => ( // Renamed 'Requests' to 'request' for clarity
            <li key={request._id} className="bg-gray-800 p-4 rounded-lg text-white">
              <p><strong>Teacher:</strong> {request.teacher}</p>
              <p><strong>Date:</strong> {new Date(request.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {request.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Requests;