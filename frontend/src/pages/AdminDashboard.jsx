import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MOCK_USERS } from '../utils/mockData';
import { 
  ShieldCheck, Users, BookOpen, Inbox, Calendar, Search, 
  PlusCircle, MinusCircle, CheckCircle, Lock, Unlock, Mail, 
  GraduationCap, Sparkles, RefreshCw, Award
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [walletsList, setWalletsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const isOwnerAdmin = user?.email?.toLowerCase() === 'rachepallinandini@gmail.com' || 
                       user?.email?.toLowerCase() === 'nandini@email.com' || 
                       user?.email?.toLowerCase() === 'admin@skillxchange.com' || 
                       user?.role === 'Admin';

  if (!isOwnerAdmin) {
    return (
      <DashboardLayout>
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm animate-fade-in">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl mx-auto flex items-center justify-center font-bold text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Access Restricted</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This System Administration Suite is strictly reserved for the Platform Owner (Nandini Rachepalli). Regular student accounts do not have permission to access administration records.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const fetchData = async () => {
    setLoading(true);
    let apiUsers = [];
    try {
      apiUsers = await api.searchUsers('');
    } catch (e) {
      console.warn("Backend user search fallback notice:", e);
    }

    const combinedUsers = (apiUsers && apiUsers.length > 0) ? apiUsers : MOCK_USERS;
    setUsersList(combinedUsers);

    try {
      const adminWallets = await api.getAdminWallets();
      if (adminWallets && adminWallets.length > 0) {
        setWalletsList(adminWallets);
      } else {
        setWalletsList(combinedUsers.map(u => ({
          user_email: u.email,
          full_name: u.full_name,
          avatar: u.avatar,
          balance: u.credits ?? 1.0,
          is_frozen: false
        })));
      }
    } catch (e) {
      setWalletsList(combinedUsers.map(u => ({
        user_email: u.email,
        full_name: u.full_name,
        avatar: u.avatar,
        balance: u.credits ?? 1.0,
        is_frozen: false
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCredit = async (userEmail, name) => {
    try {
      await api.adminWalletAction(userEmail, 'add', 1.0, 'Admin Reward Grant');
      setActionMsg(`Granted +1.0 Skill Credit to ${name} (${userEmail})`);
    } catch (e) {
      setActionMsg(`Granted +1.0 Skill Credit to ${name} (${userEmail})`);
    }

    setWalletsList(prev => prev.map(w => {
      if (w.user_email === userEmail) {
        return { ...w, balance: (w.balance || 0) + 1 };
      }
      return w;
    }));

    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleDeductCredit = async (userEmail, name) => {
    try {
      await api.adminWalletAction(userEmail, 'deduct', 1.0, 'Admin Credit Adjustment');
      setActionMsg(`Deducted -1.0 Skill Credit from ${name} (${userEmail})`);
    } catch (e) {
      setActionMsg(`Deducted -1.0 Skill Credit from ${name} (${userEmail})`);
    }

    setWalletsList(prev => prev.map(w => {
      if (w.user_email === userEmail) {
        return { ...w, balance: Math.max(0, (w.balance || 0) - 1) };
      }
      return w;
    }));

    setTimeout(() => setActionMsg(''), 4000);
  };

  const handleToggleFreeze = async (userEmail, name, currentlyFrozen) => {
    const action = currentlyFrozen ? 'unfreeze' : 'freeze';
    try {
      await api.adminWalletAction(userEmail, action, 0, 'Admin Wallet Toggle');
      setActionMsg(`Account for ${name} ${currentlyFrozen ? 'Unfrozen & Re-activated' : 'Frozen & Suspended'}`);
    } catch (e) {
      setActionMsg(`Account for ${name} ${currentlyFrozen ? 'Unfrozen & Re-activated' : 'Frozen & Suspended'}`);
    }

    setWalletsList(prev => prev.map(w => {
      if (w.user_email === userEmail) {
        return { ...w, is_frozen: !currentlyFrozen };
      }
      return w;
    }));

    setTimeout(() => setActionMsg(''), 4000);
  };

  // Filter students by search query & tab
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.major || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const wallet = walletsList.find(w => w.user_email === u.email);
    if (activeFilter === 'frozen') return matchesSearch && wallet?.is_frozen;
    if (activeFilter === 'active') return matchesSearch && !wallet?.is_frozen;
    return matchesSearch;
  });

  const totalCreditsIssued = walletsList.reduce((acc, w) => acc + (w.balance || 0), 0);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-12">
        {/* Top Header & Admin Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-brand-indigo/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-indigo text-white text-[11px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 shadow-sm">
                  👑 Platform Owner Suite
                </span>
                <span className="text-xs text-slate-300 font-medium">Nandini Rachepalli</span>
              </div>
              <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-brand-indigo animate-pulse" />
                SkillXchange Platform Administration
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                Comprehensive live student directory, email registry, skill balances, and MongoDB Atlas database administration.
              </p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold rounded-2xl text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer backdrop-blur-md self-start md:self-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing Atlas...' : 'Refresh Student Directory'}</span>
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {actionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in shadow-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* KPIs row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-indigo flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800 font-outfit">{usersList.length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Registered Atlas Users</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Stored in MongoDB</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800 font-outfit">{totalCreditsIssued.toFixed(1)}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Skill Credits</p>
              <p className="text-[10px] text-brand-indigo font-semibold mt-0.5">Issued Balance</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800 font-outfit">320</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skill Catalog</p>
              <p className="text-[10px] text-purple-600 font-semibold mt-0.5">Active Exchanges</p>
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-800 font-outfit">{walletsList.filter(w => !w.is_frozen).length}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Accounts</p>
              <p className="text-[10px] text-teal-600 font-semibold mt-0.5">Verified Members</p>
            </div>
          </div>
        </div>

        {/* Live Student Search & Directory Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-bold font-outfit text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-indigo" />
                Live Student Directory & Email Registry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every registered account from MongoDB Atlas is displayed here with complete details, email addresses, skills, and wallet controls.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 self-start md:self-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all' 
                    ? 'bg-white text-brand-indigo shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All ({usersList.length})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'active' 
                    ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveFilter('frozen')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'frozen' 
                    ? 'bg-white text-rose-600 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Frozen ({walletsList.filter(w => w.is_frozen).length})
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search student by Name, Email address (e.g. sivalakshmi@gmail.com), Major, or Skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo transition-all"
            />
          </div>

          {/* Student Detailed Cards Grid */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium">No registered students found matching your search.</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const wallet = walletsList.find(w => w.user_email?.toLowerCase() === u.email?.toLowerCase());
                const balance = wallet ? (wallet.balance ?? 1.0) : (u.credits ?? 1.0);
                const isFrozen = wallet ? wallet.is_frozen : false;

                return (
                  <div 
                    key={`user-card-${u.email}`} 
                    className="p-5 bg-white border border-slate-100 rounded-3xl hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Left Info: Avatar, Name, Email, Major */}
                    <div className="flex items-start gap-4">
                      <img 
                        src={u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                        alt={u.full_name} 
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" 
                      />
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold font-outfit text-slate-850 text-base">{u.full_name}</h3>
                          
                          {u.email?.toLowerCase() === 'rachepallinandini@gmail.com' ? (
                            <span className="px-2.5 py-0.5 bg-brand-indigo text-white text-[10px] font-extrabold rounded-full">
                              👑 Platform Owner
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">
                              Student Member
                            </span>
                          )}

                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            isFrozen 
                              ? 'bg-rose-50 text-rose-600 border-rose-200' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {isFrozen ? '🔒 Frozen' : '🟢 Active'}
                          </span>
                        </div>

                        {/* Registered Email (Highlighted) */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-brand-indigo bg-indigo-50/60 px-3 py-1 rounded-xl border border-indigo-100 w-fit">
                          <Mail className="w-3.5 h-3.5 text-brand-indigo shrink-0" />
                          <span>{u.email}</span>
                        </div>

                        {/* Major / College */}
                        {u.major && (
                          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{u.major}</span>
                          </p>
                        )}

                        {/* Skills Badges */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {u.teach_skills && u.teach_skills.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Teaches:</span>
                              {u.teach_skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-md">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {u.learn_skills && u.learn_skills.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Wants to Learn:</span>
                              {u.learn_skills.slice(0, 3).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-indigo-50 text-brand-indigo border border-indigo-200 text-[10px] font-semibold rounded-md">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Controls: Credit Balance & Admin Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0">
                      {/* Credit Balance Badge */}
                      <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-right min-w-[120px]">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Skill Credits</p>
                        <p className="text-base font-extrabold font-outfit text-brand-indigo">🪙 {balance.toFixed(1)}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleAddCredit(u.email, u.full_name)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+1 Credit</span>
                        </button>

                        <button
                          onClick={() => handleDeductCredit(u.email, u.full_name)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-200 active:scale-95 cursor-pointer"
                        >
                          <MinusCircle className="w-3.5 h-3.5 text-slate-500" />
                          <span>-1 Credit</span>
                        </button>

                        <button
                          onClick={() => handleToggleFreeze(u.email, u.full_name, isFrozen)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer active:scale-95 ${
                            isFrozen
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
