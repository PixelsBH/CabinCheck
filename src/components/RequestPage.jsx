import React, { useEffect, useState } from "react";

function Requests({ user }) {
  const [Requestss, setRequestss] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequestss = async () => {
      try {
        const response = await fetch(`http://localhost:5000/routes/meetings/${user.username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Requests");
        }
        const data = await response.json();
        setRequestss(data);
      } catch (error) {
        console.error("Error fetching Requests:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Requestss initially
    fetchRequestss();

    // Set up polling every 3 seconds
    const interval = setInterval(fetchRequestss, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [user.username]);

  if (loading) {
    return <div className="text-white">Loading Requests...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Requests</h1>
      {Requestss.length === 0 ? (
        <p className="text-gray-400">No Requests available.</p>
      ) : (
        <ul className="space-y-4">
          {Requestss.map((Requests) => (
            <li key={Requests._id} className="bg-gray-800 p-4 rounded-lg text-white">
              <p><strong>Teacher:</strong> {Requests.teacher}</p>
              <p><strong>Date:</strong> {new Date(Requests.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {Requests.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Requests;