import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Bell, Check, Inbox, MessageSquare, Star } from 'lucide-react';
import { MOCK_USERS } from '../utils/mockData';

export default function Notifications() {
  const mockNotifications = [
    { id: "1", type: "request", title: "Ravi Teja sent you an exchange request", desc: "Wants to learn Python, offers C++", time: "2 hours ago", icon: Inbox, color: "bg-indigo-50 text-brand-indigo" },
    { id: "2", type: "accept", title: "Charan K accepted your request", desc: "React JS Basics scheduled successfully", time: "1 day ago", icon: Check, color: "bg-emerald-50 text-brand-emerald" },
    { id: "3", type: "alert", title: "Session starts in 30 minutes", desc: "Python Programming with Charan K", time: "30 minutes ago", icon: Bell, color: "bg-amber-50 text-brand-amber" },
    { id: "4", type: "message", title: "New message from Likhitha S", desc: "\"Hi! Let me know if tomorrow works...\"", time: "2 days ago", icon: MessageSquare, color: "bg-blue-50 text-blue-500" },
    { id: "5", type: "review", title: "You received a 5-star review", desc: "Charan K left a review: \"Great teaching!\"", time: "4 days ago", icon: Star, color: "bg-purple-50 text-purple-500" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-800">Notifications</h1>
            <p className="text-sm text-slate-500">Stay up to date with requests, chats, and scheduled sessions.</p>
          </div>
          <button className="text-xs font-bold text-brand-indigo hover:underline">Mark all as read</button>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm divide-y divide-slate-50">
          {mockNotifications.map((notif) => (
            <div key={notif.id} className="py-4 flex gap-4 items-start first:pt-0 last:pb-0 hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                <notif.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800 font-outfit">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-500">{notif.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
