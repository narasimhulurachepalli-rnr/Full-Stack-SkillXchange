import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_EXCHANGES, MOCK_USERS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Check, X, Calendar, Video, BookOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getCombinedExchanges = () => {
  let custom = [];
  try {
    const stored = localStorage.getItem('skillxchange_custom_exchanges');
    if (stored) custom = JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse custom exchanges from localStorage", e);
  }
  
  const map = new Map();
  MOCK_EXCHANGES.forEach(ex => map.set(ex.id, ex));
  custom.forEach(ex => map.set(ex.id, ex));
  return Array.from(map.values());
};

export default function Requests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received');
  
  // States for list
  const [exchanges, setExchanges] = useState(getCombinedExchanges);
  
  // Modal states for Scheduler
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionLink, setSessionLink] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const email = user?.email || "nandini@email.com";

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
      } catch (err) {
        console.warn("API exchanges fetch unavailable or mock mode active:", err);
      }
    };
    fetchBackendExchanges();
  }, []);

  // Filter exchanges
  const receivedExchanges = exchanges.filter(e => e.receiver_email === email && e.status === 'Pending');
  const sentExchanges = exchanges.filter(e => e.sender_email === email && e.status === 'Pending');
  const completedExchanges = exchanges.filter(e => e.status === 'Completed');

  const updateLocalStorageExchanges = (updatedList) => {
    try {
      localStorage.setItem('skillxchange_custom_exchanges', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const handleDecline = async (id) => {
    setExchanges(prev => {
      const next = prev.map(e => e.id === id ? { ...e, status: 'Declined' } : e);
      updateLocalStorageExchanges(next);
      return next;
    });
    try {
      await api.updateExchangeStatus(id, 'decline');
    } catch (e) {}
  };

  const handleAcceptClick = (exchange) => {
    setSelectedExchange(exchange);
    setSessionTitle(`${exchange.learn_skill} & ${exchange.teach_skill} Swap`);
    setIsSchedulerOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setScheduleSuccess(true);
    
    // Update local exchange status to "Accepted"
    setExchanges(prev => {
      const next = prev.map(ex => ex.id === selectedExchange.id ? { ...ex, status: 'Accepted' } : ex);
      updateLocalStorageExchanges(next);
      return next;
    });

    try {
      await api.updateExchangeStatus(selectedExchange.id, 'accept');
    } catch (err) {}
    
    setTimeout(() => {
      setIsSchedulerOpen(false);
      setScheduleSuccess(false);
      navigate('/sessions');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">Skill Exchange Requests</h1>
          <p className="text-sm text-slate-500">Manage incoming and outgoing proposals for peer skill sharing.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm shrink-0 border-b-2 transition-all ${
                activeTab === 'received' 
                  ? 'border-brand-indigo text-brand-indigo' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Received ({receivedExchanges.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm shrink-0 border-b-2 transition-all ${
                activeTab === 'sent' 
                  ? 'border-brand-indigo text-brand-indigo' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Sent ({sentExchanges.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm shrink-0 border-b-2 transition-all ${
                activeTab === 'completed' 
                  ? 'border-brand-indigo text-brand-indigo' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Completed ({completedExchanges.length})
            </button>
          </div>

          {/* Tab contents */}
          <div className="space-y-4">
            {activeTab === 'received' && (
              receivedExchanges.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No pending incoming requests.</p>
              ) : (
                receivedExchanges.map((req) => {
                  const partner = req.sender_profile || MOCK_USERS.find(u => u.email === req.sender_email) || { 
                    full_name: req.sender_email ? req.sender_email.split('@')[0] : "Peer User", 
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" 
                  };
                  return (
                    <div key={req.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all duration-200">
                      <div className="flex gap-4">
                        <img 
                          src={partner.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"} 
                          alt={partner.full_name} 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            {partner.full_name} wants to swap skills
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-slate-500">Wants:</span>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-brand-indigo/10 text-brand-indigo font-semibold rounded-full text-[10px]">{req.learn_skill}</span>
                            <span className="text-slate-500">&bull; Offers:</span>
                            <span className="px-2 py-0.5 bg-emerald-50 border border-brand-emerald/10 text-brand-emerald font-semibold rounded-full text-[10px]">{req.teach_skill}</span>
                          </div>
                          {req.message && (
                            <p className="text-xs text-slate-400 italic mt-2 bg-white p-2 rounded-lg border border-slate-100">"{req.message}"</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-3 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleDecline(req.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-brand-rose/5 text-brand-rose border border-brand-rose/10 rounded-xl text-xs font-semibold shadow-sm transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptClick(req)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-indigo/15 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            )}

            {activeTab === 'sent' && (
              sentExchanges.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No pending outgoing requests.</p>
              ) : (
                sentExchanges.map((req) => {
                  const partner = req.receiver_profile || MOCK_USERS.find(u => u.email === req.receiver_email) || { 
                    full_name: req.receiver_email ? req.receiver_email.split('@')[0] : "Peer User", 
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" 
                  };
                  return (
                    <div key={req.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4">
                        <img 
                          src={partner.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"} 
                          alt={partner.full_name} 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            Sent to {partner.full_name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-slate-500">You learn:</span>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-brand-indigo/10 text-brand-indigo font-semibold rounded-full text-[10px]">{req.learn_skill}</span>
                            <span className="text-slate-500">&bull; You teach:</span>
                            <span className="px-2 py-0.5 bg-emerald-50 border border-brand-emerald/10 text-brand-emerald font-semibold rounded-full text-[10px]">{req.teach_skill}</span>
                          </div>
                          {req.message && (
                            <p className="text-xs text-slate-400 italic mt-2 bg-white p-2 rounded-lg border border-slate-100">"{req.message}"</p>
                          )}
                        </div>
                      </div>
                      
                      <span className="px-3.5 py-1 bg-amber-50 text-brand-amber border border-brand-amber/15 text-[10px] font-bold rounded-full uppercase tracking-wider self-end md:self-auto">
                        Pending
                      </span>
                    </div>
                  );
                })
              )
            )}

            {activeTab === 'completed' && (
              completedExchanges.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No completed swaps recorded.</p>
              ) : (
                completedExchanges.map((req) => {
                  const isSender = req.sender_email === email;
                  const partnerEmail = isSender ? req.receiver_email : req.sender_email;
                  const partnerProfile = isSender ? req.receiver_profile : req.sender_profile;
                  const partner = partnerProfile || MOCK_USERS.find(u => u.email === partnerEmail) || { 
                    full_name: partnerEmail ? partnerEmail.split('@')[0] : "Peer User", 
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                  };
                  
                  return (
                    <div key={req.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex gap-4">
                        <img 
                          src={partner.avatar} 
                          alt={partner.full_name} 
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">
                            Swap completed with {partner.full_name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {isSender 
                              ? `Learnt: ${req.learn_skill} | Taught: ${req.teach_skill}` 
                              : `Learnt: ${req.teach_skill} | Taught: ${req.learn_skill}`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <span className="px-3.5 py-1 bg-emerald-50 text-brand-emerald border border-brand-emerald/15 text-[10px] font-bold rounded-full uppercase tracking-wider self-end md:self-auto">
                        Completed
                      </span>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>

        {/* Scheduler Modal */}
        {isSchedulerOpen && selectedExchange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg relative shadow-2xl animate-scale-up">
              <button 
                onClick={() => setIsSchedulerOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold font-outfit text-slate-800 mb-2">Schedule Swap Session</h2>
              <p className="text-xs text-slate-500 mb-6">Select a date, time, and coordinates to schedule your virtual meeting room.</p>

              {scheduleSuccess ? (
                <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-2xl text-center space-y-2">
                  <h3 className="font-bold">Session Scheduled!</h3>
                  <p className="text-xs">Meeting coordinate calendar entries have been generated.</p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Title</label>
                    <input 
                      type="text"
                      required
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                      <input 
                        type="date"
                        required
                        value={sessionDate}
                        onChange={(e) => setSessionDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Time</label>
                      <input 
                        type="time"
                        required
                        value={sessionTime}
                        onChange={(e) => setSessionTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meeting Link (Zoom/Meet)</label>
                    <input 
                      type="url"
                      required
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={sessionLink}
                      onChange={(e) => setSessionLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Additional Notes</label>
                    <textarea 
                      value={sessionNotes}
                      onChange={(e) => setSessionNotes(e.target.value)}
                      placeholder="List details like syllabus units or tools needed."
                      rows="3"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsSchedulerOpen(false)}
                      className="px-5 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 text-sm font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 rounded-xl shadow-lg shadow-brand-indigo/15"
                    >
                      Confirm Schedule
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
