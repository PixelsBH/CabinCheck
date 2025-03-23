import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import WelcomeCard from './components/WelcomeCard';
import Notifications from './components/Notification';
import NotificationItem from './components/NotificationItem';

function App() {
  const [currentDate] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  const notifications = [
    { id: 1, title: "Assignment Due", message: "Your Advanced Mathematics assignment is due tomorrow", time: "2 hours ago", type: "urgent" },
    { id: 2, title: "Grade Posted", message: "New grade posted for Computer Science", time: "5 hours ago", type: "info" },
    { id: 3, title: "Event Reminder", message: "Student Council meeting tomorrow at 3 PM", time: "1 day ago", type: "info" }
  ];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Profile />
        <WelcomeCard currentDate={currentDate} />
        <Notifications notifications={notifications} />
      </main>
    </div>
  );
}

export default App;
