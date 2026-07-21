import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Search, Calendar, Wallet, User 
} from 'lucide-react';

export default function BottomNav() {
  const items = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore', path: '/explore', icon: Search },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Sessions', path: '/sessions', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex justify-around items-center shadow-2xl">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all duration-200 ${
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
    </div>
  );
}
