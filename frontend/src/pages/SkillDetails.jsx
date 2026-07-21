import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_SKILLS, MOCK_USERS } from '../utils/mockData';
import { Star, BookOpen, Clock, Users, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function SkillDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');
  
  // Display details for React JS by default as per Screen 10 mockup
  const skill = MOCK_SKILLS[0]; 
  const teacher = MOCK_USERS[0]; // Charan K teaches React JS

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Back navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </button>

        {/* Skill card detail panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-6 max-w-xl">
            {/* Category Icon & Title */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-brand-indigo flex items-center justify-center shadow-inner">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold font-outfit text-slate-800">{skill.name}</h1>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{skill.category_name} &bull; Intermediate Level</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed">
              {skill.description} Learn from basics to advanced concepts including functional component structures, state hooks, props mapping, and client routes routing.
            </p>

            {/* Metric widgets */}
            <div className="flex gap-6 text-xs font-semibold text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>8 Hours total</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>12 active students</span>
              </div>
            </div>
          </div>

          {/* Teacher Profile Widget */}
          <div className="w-full md:w-80 bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taught by</h3>
            <div className="flex items-center gap-3">
              <img 
                src={teacher.avatar} 
                alt={teacher.full_name} 
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-800 font-outfit">{teacher.full_name}</h4>
                <p className="text-xs text-slate-500">{teacher.major}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
              <span>{teacher.rating_avg} Rating</span>
            </div>

            <Link 
              to={`/profile?email=${teacher.email}`}
              className="w-full py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-xs font-semibold flex items-center justify-center shadow-md shadow-brand-indigo/10 transition-all"
            >
              Send Request to Learn
            </Link>
          </div>
        </div>

        {/* Tab section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex border-b border-slate-100 pb-2">
            {['about', 'syllabus', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold text-sm capitalize border-b-2 transition-all ${
                  activeTab === tab 
                    ? 'border-brand-indigo text-brand-indigo' 
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {activeTab === 'about' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-850 font-outfit">Syllabus Overview</h3>
                <p className="text-sm text-slate-500">
                  This skill covers functional React paradigms. It is recommended that you have basic familiarity with JavaScript variables, arrow functions, and array filters.
                </p>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <ul className="space-y-3 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full"></span>
                  <span>Unit 1: React components composition and dynamic Props configurations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full"></span>
                  <span>Unit 2: State Hooks (useState, useEffect, useContext)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-indigo rounded-full"></span>
                  <span>Unit 3: Route management with React Router</span>
                </li>
              </ul>
            )}

            {activeTab === 'reviews' && (
              <p className="text-sm text-slate-400 text-center py-4">No reviews recorded specifically for this skill catalog item.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
