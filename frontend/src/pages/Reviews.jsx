import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_REVIEWS, MOCK_USERS } from '../utils/mockData';
import { Star } from 'lucide-react';

export default function Reviews() {
  const reviews = MOCK_REVIEWS;

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">Reviews & Ratings</h1>
          <p className="text-sm text-slate-500">Read what other community peers have written about your swap classes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-center h-fit">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Overall Rating</h3>
            <p className="text-5xl font-extrabold text-slate-850 font-outfit">4.6</p>
            <div className="flex justify-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500">Based on 24 community completions</p>
          </div>

          {/* Feed */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3">Student Testimonials</h3>
            <div className="space-y-4">
              {reviews.map((rev) => {
                const author = MOCK_USERS.find(u => u.email === rev.reviewer_email) || { full_name: "Charan K", avatar: "" };
                return (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={author.avatar} alt={author.full_name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-700">{author.full_name}</p>
                          <p className="text-[10px] text-slate-400">July 18, 2026</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">"{rev.comment}"</p>
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
