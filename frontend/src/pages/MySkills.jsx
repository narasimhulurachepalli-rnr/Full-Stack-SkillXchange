import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function MySkills() {
  const { user, updateProfile } = useAuth();
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');

  const handleAddTeach = (e) => {
    e.preventDefault();
    if (!newTeach.trim()) return;
    const updated = [...(user?.teach_skills || []), newTeach.trim()];
    updateProfile({ teach_skills: updated });
    setNewTeach('');
  };

  const handleAddLearn = (e) => {
    e.preventDefault();
    if (!newLearn.trim()) return;
    const updated = [...(user?.learn_skills || []), newLearn.trim()];
    updateProfile({ learn_skills: updated });
    setNewLearn('');
  };

  const handleDeleteTeach = (skill) => {
    const updated = (user?.teach_skills || []).filter(s => s !== skill);
    updateProfile({ teach_skills: updated });
  };

  const handleDeleteLearn = (skill) => {
    const updated = (user?.learn_skills || []).filter(s => s !== skill);
    updateProfile({ learn_skills: updated });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">My Skill Catalog</h1>
          <p className="text-sm text-slate-500">Configure what you can offer to teach and what you want to learn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Teachable skills manager */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-outfit text-brand-emerald flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skills I Can Teach
            </h2>
            
            <form onSubmit={handleAddTeach} className="flex gap-3">
              <input
                type="text"
                value={newTeach}
                onChange={(e) => setNewTeach(e.target.value)}
                placeholder="Add skill (e.g. JavaScript)"
                className="flex-grow px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
              />
              <button type="submit" className="p-2.5 bg-brand-emerald hover:bg-brand-emerald/90 text-white rounded-xl shadow-md">
                <Plus className="w-5 h-5" />
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {user?.teach_skills?.map((skill) => (
                <div key={skill} className="py-3 flex justify-between items-center text-sm font-semibold text-slate-700">
                  <span>{skill}</span>
                  <button onClick={() => handleDeleteTeach(skill)} className="p-2 text-slate-400 hover:text-brand-rose rounded-lg hover:bg-slate-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Learnable skills manager */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-outfit text-brand-indigo flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skills I Want to Learn
            </h2>
            
            <form onSubmit={handleAddLearn} className="flex gap-3">
              <input
                type="text"
                value={newLearn}
                onChange={(e) => setNewLearn(e.target.value)}
                placeholder="Add skill (e.g. Photoshop)"
                className="flex-grow px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
              />
              <button type="submit" className="p-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl shadow-md">
                <Plus className="w-5 h-5" />
              </button>
            </form>

            <div className="divide-y divide-slate-100">
              {user?.learn_skills?.map((skill) => (
                <div key={skill} className="py-3 flex justify-between items-center text-sm font-semibold text-slate-700">
                  <span>{skill}</span>
                  <button onClick={() => handleDeleteLearn(skill)} className="p-2 text-slate-400 hover:text-brand-rose rounded-lg hover:bg-slate-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
