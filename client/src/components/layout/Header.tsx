'use client';

import { Search, Bell } from 'lucide-react';
import { useState } from 'react';
import { useLayout } from '../../context/layout/useLayout';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { isCollapsed } = useLayout();

  return (
    <header className={`fixed  top-0 right-0 z-40 h-16 bg-gray-950 backdrop-blur-md transition-all duration-300
      ${isCollapsed ? 'left-20' : 'left-44'}`}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Search */}
        <div className="flex-1 max-w-md mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks, workspaces..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}