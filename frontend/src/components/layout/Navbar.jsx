import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Share2 } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-brand-indigo flex items-center justify-center text-white shadow-lg shadow-brand-indigo/30">
          <Share2 className="w-5 h-5 animate-pulse" />
        </div>
        <span className="text-xl font-bold font-outfit tracking-tight text-slate-800">
          Skill<span className="text-brand-indigo">Xchange</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#how-it-works" className="text-sm font-medium text-brand-slate hover:text-brand-indigo transition-colors">How It Works</a>
        <a href="#features" className="text-sm font-medium text-brand-slate hover:text-brand-indigo transition-colors">Features</a>
        <a href="#testimonials" className="text-sm font-medium text-brand-slate hover:text-brand-indigo transition-colors">Success Stories</a>
        <a href="#contact" className="text-sm font-medium text-brand-slate hover:text-brand-indigo transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            {/* Skill Credit balance badge */}
            <Link to="/wallet" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>🪙 {user?.credits ?? 1} Skill Credit{user?.credits === 1 ? '' : 's'}</span>
            </Link>

            <Link to="/dashboard" className="px-5 py-2 text-sm font-semibold text-white bg-brand-indigo rounded-xl shadow-md hover:bg-brand-indigo/90 transition-all active:scale-95 duration-200">
              Dashboard
            </Link>
            <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-brand-rose border border-brand-rose/20 rounded-xl hover:bg-brand-rose/5 transition-all">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-semibold text-brand-slate hover:text-brand-indigo transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-semibold text-white bg-brand-indigo rounded-xl shadow-md shadow-brand-indigo/20 hover:bg-brand-indigo/90 transition-all active:scale-95 duration-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
