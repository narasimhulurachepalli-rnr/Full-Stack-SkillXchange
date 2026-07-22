import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_USERS, MOCK_REVIEWS } from '../utils/mockData';
import { api } from '../services/api';
import { Star, MessageSquare, BookOpen, Calendar, Mail, FileText, ArrowRight, X, LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user: currentUser, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  
  // Modal states for Send Request
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLearnSkill, setSelectedLearnSkill] = useState('');
  const [selectedTeachSkill, setSelectedTeachSkill] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);

  const userEmail = searchParams.get('email') || currentUser?.email;
  const isSelf = userEmail === currentUser?.email;

  // Find user details
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (isSelf) {
      setUserProfile(currentUser);
    } else {
      const found = MOCK_USERS.find(u => u.email === userEmail);
      setUserProfile(found || currentUser);
    }
  }, [userEmail, currentUser, isSelf]);

  useEffect(() => {
    if (userProfile) {
      const teachList = userProfile.teach_skills || ["React JS", "Python Backend"];
      const learnList = userProfile.learn_skills || ["UI/UX Design", "Machine Learning"];
      setSelectedLearnSkill(teachList[0] || 'Skill Swap');
      setSelectedTeachSkill(currentUser?.teach_skills?.[0] || 'Peer Mentoring');
    }
  }, [userProfile, currentUser]);

  if (!userProfile) {
    return (
      <DashboardLayout>
        <p className="text-center text-slate-400 py-12">Loading profile...</p>
      </DashboardLayout>
    );
  }

  // Filter reviews
  const reviews = MOCK_REVIEWS.filter(r => r.reviewee_email === userProfile.email);

  const handleProposeSubmit = async (e) => {
    e.preventDefault();
    
    const senderEmail = currentUser?.email || "nandini@email.com";
    const receiverEmail = userProfile.email;
    
    const newExchange = {
      id: `ex-${Date.now()}`,
      sender_email: senderEmail,
      receiver_email: receiverEmail,
      learn_skill: selectedLearnSkill,
      teach_skill: selectedTeachSkill,
      message: proposalMessage,
      status: 'Pending',
      created_at: new Date().toISOString(),
      sender_profile: currentUser,
      receiver_profile: userProfile
    };

    try {
      await api.createExchange(receiverEmail, selectedLearnSkill, selectedTeachSkill, proposalMessage);
    } catch (err) {
      console.warn("Backend request create failed or mock mode in use, saving locally:", err);
    }

    try {
      const existingStr = localStorage.getItem('skillxchange_custom_exchanges');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newExchange, ...existing];
      localStorage.setItem('skillxchange_custom_exchanges', JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save exchange to localStorage:", err);
    }

    setRequestSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setRequestSuccess(false);
      setProposalMessage('');
      navigate('/requests');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Profile Card Header Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Cover color band */}
          <div className="h-32 bg-gradient-to-r from-brand-indigo via-indigo-500 to-purple-600"></div>
          
          <div className="p-6 md:p-8 relative">
            {/* Overlapping Avatar */}
            <div className="absolute -top-12 left-6 md:-top-16 md:left-8">
              <img 
                src={userProfile.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                alt={userProfile.full_name} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-4 border-white shadow-md"
              />
            </div>
            
            <div className="pt-10 md:pt-0 md:pl-28 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold font-outfit text-slate-800">{userProfile.full_name}</h1>
                  {userProfile.is_verified && (
                    <span className="px-2.5 py-0.5 bg-brand-indigo/10 text-brand-indigo text-[10px] font-bold rounded-full">
                      Verified Account
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-400">{userProfile.major}</p>
                
                {/* Rating & Stats row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                    {userProfile.rating_avg}
                  </span>
                  <span>|</span>
                  <span className="text-brand-indigo font-bold">{userProfile.points} XP</span>
                  <span>|</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 font-extrabold rounded-full">
                    🪙 {userProfile.credits ?? 1} Credit{userProfile.credits === 1 ? '' : 's'}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="hidden sm:inline">24 Swaps</span>
                </div>
              </div>

              {/* Action row (display LogOut if self, or Message/Propose if viewing others) */}
              {isSelf ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={logout}
                    className="px-5 py-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 duration-200 cursor-pointer shadow-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => navigate(`/chat?partner=${userProfile.email}`)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-95 duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/15 transition-all active:scale-95 duration-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    Propose Swap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details & Tab Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Workspace Left column (2 cols wide) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-6">
            <div className="flex border-b border-slate-100 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap">
              {['about', 'skills', 'credits history', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm capitalize border-b-2 shrink-0 transition-all ${
                    activeTab === tab 
                      ? 'border-brand-indigo text-brand-indigo' 
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-2">
              {activeTab === 'about' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 font-outfit">Biography</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {userProfile.bio || "No biography added yet. Users write profiles detailing their availability and teaching background."}
                  </p>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold font-outfit text-sm text-brand-emerald uppercase tracking-wider">Skills I Can Teach</h4>
                    <div className="flex flex-col gap-2">
                      {(userProfile.teach_skills || ["React JS", "Python Backend", "Tailwind CSS"]).map(s => (
                        <div key={s} className="p-3 bg-emerald-50/50 border border-brand-emerald/10 text-brand-emerald text-sm font-semibold rounded-xl flex items-center justify-between">
                          <span>{s}</span>
                          <span className="text-[10px] bg-brand-emerald text-white px-2 py-0.5 rounded-md font-bold">Expert</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold font-outfit text-sm text-brand-indigo uppercase tracking-wider">Skills I Want to Learn</h4>
                    <div className="flex flex-col gap-2">
                      {(userProfile.learn_skills || ["UI/UX Design", "Machine Learning", "Figma"]).map(s => (
                        <div key={s} className="p-3 bg-indigo-50/50 border border-brand-indigo/10 text-brand-indigo text-sm font-semibold rounded-xl flex items-center justify-between">
                          <span>{s}</span>
                          <span className="text-[10px] bg-brand-indigo text-white px-2 py-0.5 rounded-md font-bold">Interested</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'credits history' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 font-outfit mb-2">Skill Credit History & Ledger</h3>
                  {(!userProfile.credit_history || userProfile.credit_history.length === 0) ? (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🪙</span>
                        <div>
                          <p className="font-bold text-slate-800">Welcome Skill Credit Bonus</p>
                          <p className="text-slate-400">Granted automatically upon account creation</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-emerald-600">+1 Credit</span>
                    </div>
                  ) : (
                    userProfile.credit_history.map((tx) => (
                      <div key={tx.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🪙</span>
                          <div>
                            <p className="font-bold text-slate-800">{tx.description || tx.type}</p>
                            <p className="text-[10px] text-slate-400">{new Date(tx.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="font-extrabold text-emerald-600">+{tx.amount} Credit</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 font-outfit mb-2">Student Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No reviews recorded yet for this profile.</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-700">{rev.reviewer_email}</p>
                          <div className="flex text-amber-400">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 italic">"{rev.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick contact Sidebar Column */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3">Contact Information</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-indigo" />
                  <span>{userProfile.email}</span>
                </div>
                {userProfile.phone && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-brand-indigo" />
                    <span>{userProfile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-indigo" />
                  <span>{userProfile.major}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propose Exchange Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-xl relative shadow-2xl animate-scale-up">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold font-outfit text-slate-800 mb-2">Send Skill Exchange Request</h2>
              <p className="text-xs text-slate-500 mb-6">Propose a mutual skill trade. Define what you learn and what you teach.</p>

              {requestSuccess ? (
                <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-2xl text-center space-y-2">
                  <h3 className="font-bold">Request Sent!</h3>
                  <p className="text-xs">Your exchange proposal has been transmitted to {userProfile.full_name}.</p>
                </div>
              ) : (
                <form onSubmit={handleProposeSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">You Want to Learn</label>
                      <select 
                        value={selectedLearnSkill}
                        onChange={(e) => setSelectedLearnSkill(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                      >
                        {(userProfile.teach_skills || ["React JS", "Python Backend"]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">You Offer to Teach</label>
                      <select 
                        value={selectedTeachSkill}
                        onChange={(e) => setSelectedTeachSkill(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                      >
                        {currentUser?.teach_skills?.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add a message (optional)</label>
                    <textarea 
                      value={proposalMessage}
                      onChange={(e) => setProposalMessage(e.target.value)}
                      placeholder={`Hi ${userProfile.full_name.split(' ')[0]}, I'm interested in learning ${selectedLearnSkill}. I can teach you ${selectedTeachSkill} in return.`}
                      rows="4"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 text-sm font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 rounded-xl shadow-lg shadow-brand-indigo/15"
                    >
                      Send Request
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
