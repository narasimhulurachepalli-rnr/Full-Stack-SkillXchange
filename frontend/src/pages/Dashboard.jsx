import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { 
  MOCK_SESSIONS, MOCK_EXCHANGES, MOCK_USERS 
} from '../utils/mockData';
import { api } from '../services/api';
import { 
  BookOpen, Star, Inbox, CheckCircle2, 
  Calendar, Video, ArrowRight, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getCombinedExchanges = () => {
  let custom = [];
  try {
    const stored = localStorage.getItem('skillxchange_custom_exchanges');
    if (stored) custom = JSON.parse(stored);
  } catch (e) {}
  
  const map = new Map();
  MOCK_EXCHANGES.forEach(ex => map.set(ex.id, ex));
  custom.forEach(ex => map.set(ex.id, ex));
  return Array.from(map.values());
};

export default function Dashboard() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState(getCombinedExchanges);

  useEffect(() => {
    const fetchBackendExchanges = async () => {
      try {
        const backendExchanges = await api.getExchanges();
        if (Array.isArray(backendExchanges) && backendExchanges.length > 0) {
          setExchanges(prev => {
            const map = new Map();
            prev.forEach(ex => map.set(ex.id, ex));
            backendExchanges.forEach(ex => map.set(ex.id, ex));
            return Array.from(map.values());
          });
        }
      } catch (err) {}
    };
    fetchBackendExchanges();
  }, []);

  const email = user?.email || "nandini@email.com";
  // Find dynamic details
  const activeRequests = exchanges.filter(e => (e.sender_email === email || e.receiver_email === email) && e.status === 'Pending').length;
  const upcomingSessions = MOCK_SESSIONS.filter(s => s.status === 'Scheduled');

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="p-5 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#4338ca,transparent_45%)]"></div>
          <div className="relative z-10 space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-brand-indigo rounded-full text-xs font-bold font-outfit">
              <Sparkles className="w-3.5 h-3.5 fill-white stroke-none" />
              Community Knowledge Hub
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold font-outfit">
              Welcome back, {user?.full_name || "Nandini R"}!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              "Every skill you share is a seed you plant in someone's journey." List skills, schedule sessions, and enjoy payment-free learning today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          <div className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center text-lg sm:text-xl font-black">
              🪙
            </div>
            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 font-outfit">
                {user?.credits ?? 1}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">Skill Credits</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-indigo-50 text-brand-indigo rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 font-outfit">
                {user?.teach_skills?.length || 8}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">Skills I Teach</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-teal-50 text-brand-teal rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 font-outfit">
                {user?.learn_skills?.length || 6}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">Skills I Learn</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2.5 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-indigo-50 text-brand-indigo rounded-xl flex items-center justify-center">
              <Inbox className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 font-outfit">{activeRequests}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">Active Requests</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-2.5 sm:gap-4 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-emerald-50 text-brand-emerald rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 font-outfit">{user?.points || 320}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider truncate">Total XP Points</p>
            </div>
          </div>
        </div>

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions Panel */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold font-outfit text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-indigo" />
                Upcoming Sessions
              </h2>
              <Link to="/sessions" className="text-xs font-bold text-brand-indigo flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">No upcoming sessions. Swap skills to schedule one!</p>
              ) : (
                upcomingSessions.map((session) => {
                  const partnerEmail = session.teacher_email === user?.email ? session.learner_email : session.teacher_email;
                  const partner = MOCK_USERS.find(u => u.email === partnerEmail) || { full_name: "Charan K", avatar: "" };
                  const isTeacher = session.teacher_email === user?.email;
                  
                  return (
                    <div key={session.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={partner.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
                          alt={partner.full_name} 
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{session.skill_name}</p>
                          <p className="text-xs text-slate-500">
                            {isTeacher ? `Teaching ${partner.full_name}` : `Learning from ${partner.full_name}`}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(session.scheduled_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      
                      <a 
                        href={session.meeting_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-4 py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-indigo/15 transition-all"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join
                      </a>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Requests Activity */}
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold font-outfit text-slate-800 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-brand-indigo" />
                Recent Requests
              </h2>
              <Link to="/requests" className="text-xs font-bold text-brand-indigo flex items-center gap-1 hover:underline">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {exchanges.slice(0, 4).map((req) => {
                const isReceived = req.receiver_email === email;
                const partnerEmail = isReceived ? req.sender_email : req.receiver_email;
                const partnerProfile = isReceived ? req.sender_profile : req.receiver_profile;
                const partner = partnerProfile || MOCK_USERS.find(u => u.email === partnerEmail) || { 
                  full_name: partnerEmail ? partnerEmail.split('@')[0] : "Peer User", 
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" 
                };

                return (
                  <div key={req.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={partner.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"} 
                        alt={partner.full_name} 
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          {isReceived 
                            ? `${partner.full_name} wants to learn ${req.learn_skill} from you`
                            : `You sent a request to ${partner.full_name} for ${req.learn_skill}`
                          }
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">2 days ago</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                      req.status === 'Pending' 
                        ? 'bg-amber-50 text-amber-600 border-amber-200' 
                        : req.status === 'Accepted'
                          ? 'bg-emerald-50 text-brand-emerald border-brand-emerald/20'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
