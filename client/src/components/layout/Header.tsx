
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useLayout } from '../../context/layout/useLayout';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { isCollapsed } = useLayout();

  return (
    <header className={`fixed top-0 right-0 z-40 h-16 bg-gray-950 backdrop-blur-md transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-44'}`}>
      <div className="flex items-center justify-end h-full mt-1 px-6">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 hover:bg-gray-800 rounded-lg relative"
        >
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}   