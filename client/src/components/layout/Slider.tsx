
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthContext } from '../../context/useAuthContext';
import UpGrade from "../../assets/upgrade.png"
import Logo from '../ui/Logo';
import { useLayout } from '../../context/layout/useLayout';

const UpgradeIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={UpGrade} alt="Upgrade" className="w-5 h-5" {...props} />
);  

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Workspaces', href: '/workspaces', icon: Briefcase },
  { name: 'My Tasks', href: '/my-tasks', icon: CheckSquare },
  { name: 'Team', href: '/team-members', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Upgrade' , href: '/upgrade', icon: UpgradeIcon},
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuthContext();
  const location = useLocation();
  const { isCollapsed, setIsCollapsed } = useLayout();

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen dark:bg-gray-950 
        transition-all duration-300 flex flex-col
        ${isCollapsed ? 'w-18' : 'w-44'}`}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div
          className={`flex items-center dark:border-gray-800  px-2 py-8 transition-all
            ${isCollapsed ? 'px-4 justify-center' : ''}`}
        >
          {isCollapsed ? (
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-gray-900">
              TF
            </div>
          ) : (
            <Logo />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                    ${isCollapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div
            className={`flex items-center gap- rounded-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer
              ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-zinc-700 dark:text-white">Abhishek</p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={`mt-2 w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 rounded-xl transition-colors
              ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}