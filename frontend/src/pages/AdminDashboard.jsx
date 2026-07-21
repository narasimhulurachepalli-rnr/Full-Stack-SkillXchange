import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_USERS } from '../utils/mockData';
import { ShieldCheck, Users, BookOpen, Inbox, Calendar, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const kpis = [
    { name: "Total Users", value: "542", change: "+12% this week", icon: Users, color: "bg-indigo-50 text-brand-indigo" },
    { name: "Active Sessions", value: "68", change: "+8% this week", icon: Calendar, color: "bg-teal-50 text-brand-teal" },
    { name: "Total Skills", value: "320", change: "+15% this week", icon: BookOpen, color: "bg-purple-50 text-purple-500" },
    { name: "Total Requests", value: "156", change: "+18% this week", icon: Inbox, color: "bg-amber-50 text-brand-amber" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-indigo animate-pulse" />
            System Administration Dashboard
          </h1>
          <p className="text-sm text-slate-500">Monitor community exchange metrics, profiles approval, and flag resolutions.</p>
        </div>

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

        {/* Audit Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Moderation */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-slate-850 font-outfit border-b border-slate-100 pb-3">Verify Newly Registered Accounts</h3>
            <div className="divide-y divide-slate-50">
              {MOCK_USERS.map((u) => (
                <div key={u.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.full_name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-800">{u.full_name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-lg font-semibold transition-all">
                    Verify
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dispute Flags */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-slate-850 font-outfit border-b border-slate-100 pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brand-rose" />
              Active dispute reports
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs">
                <p className="font-bold text-slate-700">Flagged Session #sess-124</p>
                <p className="text-slate-500">Reporter: ravi.t@mits.ac.in. Claim: "Instructor did not show up but locked the session completion".</p>
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 font-semibold">Dismiss</button>
                  <button className="px-3 py-1 bg-brand-rose hover:bg-brand-rose/90 text-white rounded-lg font-semibold">Reverse Lock</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Wallet & Credit Management Panel */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-850 font-outfit text-base">User Wallets & Credit Administration</h3>
              <p className="text-xs text-slate-500 mt-0.5">Manage student balances, freeze suspicious wallets, and issue manual credit rewards.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {MOCK_USERS.map((u) => (
              <div key={`wallet-${u.id}`} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.full_name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className="font-bold text-slate-800">{u.full_name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold font-outfit text-indigo-600 text-sm">3.00 Credits</span>
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">Active</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => alert(`Granted +1.0 Credit to ${u.full_name}`)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all"
                    >
                      + Add Credit
                    </button>
                    <button 
                      onClick={() => alert(`Wallet frozen for ${u.full_name}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg font-semibold transition-all border border-slate-200"
                    >
                      Freeze
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
