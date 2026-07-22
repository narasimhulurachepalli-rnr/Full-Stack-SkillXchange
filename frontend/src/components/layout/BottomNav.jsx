import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Search, Wallet, User, LogOut 
} from 'lucide-react';

export default function BottomNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex justify-around items-center shadow-2xl">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold transition-all duration-200 ${
              isActive 
                ? 'text-white bg-brand-indigo shadow-md shadow-brand-indigo/30 scale-105' 
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span>{item.name}</span>
        </NavLink>
      ))}

      {/* Direct Mobile Bottom Logout Button */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl text-[10px] font-extrabold text-rose-400 hover:text-white hover:bg-rose-500/20 transition-all duration-200 cursor-pointer active:scale-95"
      >
        <LogOut className="w-5 h-5 shrink-0 text-rose-500" />
        <span>Logout</span>
      </button>
    </div>
  );
}
