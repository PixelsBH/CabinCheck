import React from 'react';
import { BookOpen } from 'lucide-react';

function WelcomeCard() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-gray-400">{currentDate}</p>
          <h2 className="text-3xl font-bold text-white">Welcome back, John!</h2>
          <p className="text-gray-300">Always stay updated in your student portal</p>
        </div>
        <div className="hidden md:block">
          <BookOpen size={48} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;