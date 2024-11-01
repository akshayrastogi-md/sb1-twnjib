import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Settings, LogOut, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ListChecks, label: 'My Lists', path: '/my-lists' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold">EmailCleaner</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors',
                location.pathname === item.path && 'bg-primary/10 text-primary font-medium'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}