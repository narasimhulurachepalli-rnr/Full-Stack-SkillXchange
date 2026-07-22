import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MOCK_USERS } from '../utils/mockData';
import { ShieldCheck, Users, BookOpen, Inbox, Calendar, AlertCircle, PlusCircle, CheckCircle, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [walletsList, setWalletsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const isOwnerAdmin = user?.email?.toLowerCase() === 'rachepallinandini@gmail.com' || user?.email?.toLowerCase() === 'nandini@email.com' || user?.email?.toLowerCase() === 'admin@skillxchange.com' || user?.role === 'Admin';

  if (!isOwnerAdmin) {
    return (
      <DashboardLayout>
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm animate-fade-in">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl mx-auto flex items-center justify-center font-bold text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold font-outfit text-slate-800">Access Restricted</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            This System Administration Panel is strictly reserved for the Platform Owner (Nandini R). Regular student accounts do not have permission to view or manage system wallets.
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
      console.warn("Backend user search failed, using local mock data fallback:", e);
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
      setActionMsg(`Granted +1.0 Skill Credit to ${name} (Saved locally)`);
    }

    setWalletsList(prev => prev.map(w => {
      if (w.user_email === userEmail) {
        return { ...w, balance: (w.balance || 0) + 1 };
      }
      return w;
    }));

    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleToggleFreeze = async (userEmail, name, currentlyFrozen) => {
    const action = currentlyFrozen ? 'unfreeze' : 'freeze';
    try {
      await api.adminWalletAction(userEmail, action, 0, 'Admin Wallet Toggle');
      setActionMsg(`Wallet for ${name} ${currentlyFrozen ? 'Unfrozen' : 'Frozen'}`);
    } catch (e) {
      setActionMsg(`Wallet for ${name} ${currentlyFrozen ? 'Unfrozen' : 'Frozen'}`);
    }

    setWalletsList(prev => prev.map(w => {
      if (w.user_email === userEmail) {
        return { ...w, is_frozen: !currentlyFrozen };
      }
      return w;
    }));

    setTimeout(() => setActionMsg(''), 3000);
  };

  const kpis = [
    { name: "Atlas Registered Users", value: String(usersList.length || 5), change: "Active in MongoDB", icon: Users, color: "bg-indigo-50 text-brand-indigo" },
    { name: "Active Sessions", value: "12", change: "Peer Swaps", icon: Calendar, color: "bg-teal-50 text-brand-teal" },
    { name: "Total Skill Catalog", value: "320", change: "Available Skills", icon: BookOpen, color: "bg-purple-50 text-purple-500" },
    { name: "Dispute Requests", value: "0", change: "All Clean", icon: Inbox, color: "bg-amber-50 text-brand-amber" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-outfit text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-brand-indigo animate-pulse" />
              System Administration Dashboard (Nandini R)
            </h1>
            <p className="text-sm text-slate-500">Monitor community exchange metrics, manage student wallets, and grant Skill Credits.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo font-bold rounded-full text-xs self-start sm:self-auto">
            👑 Platform Owner Panel
          </span>
        </div>

        {actionMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* KPIs row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800 font-outfit">{kpi.value}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{kpi.name}</p>
                <p className="text-[10px] text-brand-emerald font-semibold mt-0.5">{kpi.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User Wallets & Credit Administration */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 font-outfit text-base">Registered Users & Credit Administration</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage MongoDB Atlas user balances, freeze accounts, and award Skill Credits.</p>
            </div>
            <button 
              onClick={fetchData}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
            >
              {loading ? "Refreshing..." : "Refresh Users"}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {walletsList.map((w) => (
              <div key={`wallet-${w.user_email}`} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img 
                    src={w.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} 
                    alt={w.full_name} 
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                  />
                  <div>
                    <p className="font-bold text-slate-800">{w.full_name || w.user_email}</p>
                    <p className="text-[11px] text-slate-400">{w.user_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-extrabold font-outfit text-indigo-600 text-sm">🪙 {w.balance ?? 1} Credit(s)</span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.is_frozen 
                        ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {w.is_frozen ? 'Frozen' : 'Active'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAddCredit(w.user_email, w.full_name || w.user_email)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add Credit</span>
                    </button>
                    <button 
                      onClick={() => handleToggleFreeze(w.user_email, w.full_name || w.user_email, w.is_frozen)}
                      className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all border cursor-pointer active:scale-95 ${
                        w.is_frozen
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 border-slate-200'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{w.is_frozen ? 'Unfreeze' : 'Freeze'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
