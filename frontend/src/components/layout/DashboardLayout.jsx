import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { Menu, Bell, Search, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEFAULT_AVATAR } from '../../utils/imageUtils';
import { useNavigate, Link } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-64 bg-slate-900 flex flex-col shadow-2xl h-full">
            {/* Close trigger button inside Sidebar */}
            <div className="absolute top-4 right-4 z-10 text-white">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Top Search bar wrapper */}
            <div className="relative hidden sm:block w-64 lg:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search skills, name or keywords..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/explore?search=${e.target.value}`);
                  }
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
              />
            </div>
          </div>

          {/* Quick profile actions */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Skill Credit balance badge */}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-full text-xs font-extrabold shadow-sm">
                <span>🪙</span>
                <span>{user.credits ?? 1} Credit{user.credits === 1 ? '' : 's'}</span>
              </div>

              {/* Leaderboard points pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                <span className="text-xs font-bold font-outfit">{user.points} XP</span>
              </div>

              {/* Notification Indicator Bell */}
              <Link to="/notifications" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-indigo rounded-full ring-2 ring-white"></span>
              </Link>

              {/* User Avatar Circle */}
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt={user.full_name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-brand-indigo/25"
                />
                <span className="hidden md:inline text-sm font-semibold text-slate-700">{user.full_name.split(' ')[0]}</span>
              </Link>

              {/* Mobile & Header LogOut Button */}
              <button
                onClick={logout}
                title="Log Out"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer ml-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </header>

        {/* Dashboard inner content area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
