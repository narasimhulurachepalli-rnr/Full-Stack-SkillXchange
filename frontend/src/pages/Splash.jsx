import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2 } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/landing');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center text-white z-50">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Animated logo badge */}
        <div className="w-20 h-20 rounded-3xl bg-brand-indigo flex items-center justify-center text-white shadow-2xl shadow-brand-indigo/40 animate-bounce">
          <Share2 className="w-10 h-10" />
        </div>
        
        {/* Brand name */}
        <h1 className="text-4xl font-extrabold font-outfit tracking-tight">
          Skill<span className="text-brand-indigo">Xchange</span>
        </h1>
        
        <p className="text-slate-500 font-medium text-sm">
          Learn. Teach. Grow Together.
        </p>
      </div>

      {/* Loading progress bar */}
      <div className="absolute bottom-16 flex flex-col items-center gap-2">
        <div className="w-40 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-brand-indigo rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
        </div>
        <span className="text-xs text-slate-600 font-semibold uppercase tracking-widest">Loading</span>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
