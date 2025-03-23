import React, { useState } from 'react';
import { Search } from 'lucide-react';

function StatusInfo() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const professors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      available: true,
      office: "Room 301",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      department: "Mathematics",
      available: false,
      office: "Room 205",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      name: "Dr. Emily Williams",
      department: "Physics",
      available: true,
      office: "Room 405",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    },
    {
      id: 4,
      name: "Prof. David Brown",
      department: "Chemistry",
      available: false,
      office: "Room 102",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    }
  ];

  const filteredProfessors = professors.filter(professor =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Professor Status</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search professors..."
            className="pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessors.map(professor => (
          <div key={professor.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={professor.image}
                alt={professor.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{professor.name}</h3>
                <p className="text-gray-400">{professor.department}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-300">{professor.office}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                professor.available 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-red-900 text-red-300'
              }`}>
                {professor.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatusInfo;