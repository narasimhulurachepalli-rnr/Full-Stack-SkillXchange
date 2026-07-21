import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_LEADERBOARD } from '../utils/mockData';
import { Trophy, Star } from 'lucide-react';

export default function Leaderboard() {
  const [tab, setTab] = useState('monthly');

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">Community Leaderboard</h1>
          <p className="text-sm text-slate-500">Celebrate the top contributors sharing knowledge in the community.</p>
        </div>

        {/* Podium block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-3xl mx-auto pt-6">
          {/* 2nd Place */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col items-center gap-3 order-2 md:order-1 h-44 justify-center relative">
            <span className="absolute -top-3 w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shadow">2</span>
            <img src={MOCK_LEADERBOARD[1].avatar} alt={MOCK_LEADERBOARD[1].full_name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200" />
            <h3 className="font-bold text-sm font-outfit text-slate-800">{MOCK_LEADERBOARD[1].full_name}</h3>
            <p className="text-xs font-bold text-slate-500">{MOCK_LEADERBOARD[1].points} XP</p>
          </div>

          {/* 1st Place */}
          <div className="bg-gradient-to-b from-indigo-50 to-white border-2 border-brand-indigo/20 p-8 rounded-3xl shadow-md flex flex-col items-center gap-3 order-1 md:order-2 h-56 justify-center relative md:scale-105">
            <Trophy className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse absolute -top-10" />
            <span className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">1</span>
            <img src={MOCK_LEADERBOARD[0].avatar} alt={MOCK_LEADERBOARD[0].full_name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400" />
            <h3 className="font-bold text-base font-outfit text-slate-900">{MOCK_LEADERBOARD[0].full_name}</h3>
            <p className="text-xs font-extrabold text-brand-indigo">{MOCK_LEADERBOARD[0].points} XP</p>
          </div>

          {/* 3rd Place */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col items-center gap-3 order-3 h-40 justify-center relative">
            <span className="absolute -top-3 w-7 h-7 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-sm shadow">3</span>
            <img src={MOCK_LEADERBOARD[2].avatar} alt={MOCK_LEADERBOARD[2].full_name} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-600/30" />
            <h3 className="font-bold text-sm font-outfit text-slate-800">{MOCK_LEADERBOARD[2].full_name}</h3>
            <p className="text-xs font-bold text-slate-500">{MOCK_LEADERBOARD[2].points} XP</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex gap-4 border-b border-slate-100 pb-3">
            <button onClick={() => setTab('monthly')} className={`text-sm font-bold pb-2 border-b-2 ${tab === 'monthly' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-slate-400'}`}>This Month</button>
            <button onClick={() => setTab('alltime')} className={`text-sm font-bold pb-2 border-b-2 ${tab === 'alltime' ? 'border-brand-indigo text-brand-indigo' : 'border-transparent text-slate-400'}`}>All Time</button>
          </div>

          <div className="divide-y divide-slate-100">
            {MOCK_LEADERBOARD.slice(3).map((u) => (
              <div key={u.rank} className="py-4 flex justify-between items-center text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-4">
                  <span className="w-6 text-slate-400 text-center font-bold">{u.rank}</span>
                  <img src={u.avatar} alt={u.full_name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-outfit text-slate-800">{u.full_name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 stroke-none" />
                  <span>{u.points} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
