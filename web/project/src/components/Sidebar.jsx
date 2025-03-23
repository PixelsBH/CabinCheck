import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-neutral-800 rounded-r-3xl p-6 flex flex-col">
      <div className="bg-white text-black rounded-xl p-3 inline-block mb-8">
        <h1 className="font-bold text-xl">Cabin Check</h1>
      </div>
      <button className="flex items-center gap-2 bg-white/10 text-white rounded-xl p-4 hover:bg-white/20 transition-colors">
        <LayoutDashboard size={20} />
        <span className="font-medium">Dashboard</span>
      </button>
    </aside>
  );
};

export default Sidebar;
