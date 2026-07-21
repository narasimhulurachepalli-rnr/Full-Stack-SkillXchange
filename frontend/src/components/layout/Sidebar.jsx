import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, User, BookOpen, Search, Inbox, 
  MessageSquare, Calendar, Bell, Star, Trophy, 
  Settings, LogOut, Shield, Share2 
} from 'lucide-react';

export default function Sidebar({ onItemClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'My Skills', path: '/my-skills', icon: BookOpen },
    { name: 'Search Students', path: '/explore', icon: Search },
    { name: 'Requests', path: '/requests', icon: Inbox },
    { name: 'Messages', path: '/chat', icon: MessageSquare },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Reviews', path: '/reviews', icon: Star },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
      {/* Brand Logo header */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-indigo flex items-center justify-center text-white shadow-md">
          <Share2 className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold font-outfit tracking-tight text-white">
          Skill<span className="text-brand-indigo">Xchange</span>
        </span>
      </div>

      {/* Nav Link list */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Conditional Admin Tab */}
        {(user?.role === 'Admin' || user?.email === 'admin@skillxchange.com') && (
          <NavLink
            to="/admin"
            onClick={onItemClick}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-indigo text-white shadow-lg shadow-brand-indigo/25' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`
            }
          >
            <Shield className="w-5 h-5 shrink-0" />
            <span>Admin Dashboard</span>
          </NavLink>
        )}
      </nav>

      {/* User summary Footer panel */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
              alt={user.full_name} 
              className="w-10 h-10 rounded-xl object-cover border-2 border-brand-indigo/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-brand-rose bg-brand-rose/10 hover:bg-brand-rose hover:text-white rounded-xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
