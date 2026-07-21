import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_SESSIONS, MOCK_USERS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { Calendar, Video, CheckCircle2, Star, X } from 'lucide-react';

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Review modal states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const email = user?.email || "nandini@email.com";

  // Filter lists
  const upcomingSessions = sessions.filter(s => (s.teacher_email === email || s.learner_email === email) && s.status === 'Scheduled');
  const completedSessions = sessions.filter(s => (s.teacher_email === email || s.learner_email === email) && s.status === 'Completed');

  const handleMarkComplete = (session) => {
    setSelectedSession(session);
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewSuccess(true);
    
    // Update local session status to Completed
    setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, status: 'Completed' } : s));
    
    setTimeout(() => {
      setIsReviewOpen(false);
      setReviewSuccess(false);
      setComment('');
      setRating(5);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">My Swap Sessions</h1>
          <p className="text-sm text-slate-500">Track scheduled classes and confirm exchange completions.</p>
        </div>

        {/* Sessions Workspace Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex border-b border-slate-100 pb-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'upcoming' 
                  ? 'border-brand-indigo text-brand-indigo' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'completed' 
                  ? 'border-brand-indigo text-brand-indigo' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Completed ({completedSessions.length})
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'upcoming' && (
              upcomingSessions.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No scheduled sessions active.</p>
              ) : (
                upcomingSessions.map((session) => {
                  const partnerEmail = session.teacher_email === email ? session.learner_email : session.teacher_email;
                  const partner = MOCK_USERS.find(u => u.email === partnerEmail) || { full_name: "Charan K", avatar: "" };
                  const isTeacher = session.teacher_email === email;

                  return (
                    <div key={session.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{session.skill_name}</h3>
                          <p className="text-xs text-slate-500">
                            {isTeacher ? `Teaching: ${partner.full_name}` : `Learning from: ${partner.full_name}`}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Scheduled: {new Date(session.scheduled_time).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleMarkComplete(session)}
                          className="flex items-center gap-1 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                          Mark Completed
                        </button>
                        <Link 
                          to={`/video-session/${session.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-indigo/10 transition-all"
                        >
                          <Video className="w-3.5 h-3.5 animate-pulse" />
                          Start Live Video Call
                        </Link>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {activeTab === 'completed' && (
              completedSessions.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No completed sessions.</p>
              ) : (
                completedSessions.map((session) => {
                  const partnerEmail = session.teacher_email === email ? session.learner_email : session.teacher_email;
                  const partner = MOCK_USERS.find(u => u.email === partnerEmail) || { full_name: "Charan K", avatar: "" };
                  const isTeacher = session.teacher_email === email;

                  return (
                    <div key={session.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{session.skill_name}</h3>
                          <p className="text-xs text-slate-500">
                            {isTeacher ? `Taught: ${partner.full_name}` : `Learnt from: ${partner.full_name}`}
                          </p>
                        </div>
                      </div>
                      
                      <span className="px-3 py-1 bg-emerald-50 text-brand-emerald border border-brand-emerald/10 text-[10px] font-bold rounded-full uppercase">
                        Completed
                      </span>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Review Modal popup */}
        {isReviewOpen && selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-md relative shadow-2xl animate-scale-up">
              <button 
                onClick={() => setIsReviewOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold font-outfit text-slate-800 mb-2">Write a Review</h2>
              <p className="text-xs text-slate-500 mb-6">Confirm class completion and rate your swap partner to finalize points.</p>

              {reviewSuccess ? (
                <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-2xl text-center">
                  <h3 className="font-bold">Review Submitted!</h3>
                  <p className="text-xs">Your rating was applied successfully. +20 XP awarded.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="space-y-1 flex flex-col items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comment</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Great teaching! Helped clarify my queries."
                      rows="4"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsReviewOpen(false)}
                      className="px-5 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 text-sm font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 rounded-xl shadow-lg shadow-brand-indigo/15"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
