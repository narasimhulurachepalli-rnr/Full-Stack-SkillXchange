import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_USERS, MOCK_CATEGORIES } from '../utils/mockData';
import { api } from '../services/api';
import { Search, Star, BookOpen, MessageSquare, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [usersList, setUsersList] = useState(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      let combinedUsers = [...MOCK_USERS];
      
      // 1. Check local storage registered users
      try {
        const storedList = JSON.parse(localStorage.getItem('skillxchange_all_users') || '[]');
        storedList.forEach(u => {
          if (u && u.user && u.user.email && !combinedUsers.some(existing => existing.email?.toLowerCase() === u.user.email.toLowerCase())) {
            combinedUsers.push(u.user);
          }
        });
      } catch (e) {}

      // 2. Fetch live users from backend API
      try {
        const apiUsers = await api.searchUsers(search, category, '', '');
        if (apiUsers && Array.isArray(apiUsers) && apiUsers.length > 0) {
          apiUsers.forEach(au => {
            if (au && au.email && !combinedUsers.some(existing => existing.email?.toLowerCase() === au.email.toLowerCase())) {
              combinedUsers.push(au);
            }
          });
        }
      } catch (e) {
        console.warn("API users fetch notice, using cached list");
      }

      if (isMounted) {
        setUsersList(combinedUsers);
      }
    };

    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    // Perform local filtering on user list
    let result = usersList;
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u => 
        (u.full_name && u.full_name.toLowerCase().includes(q)) ||
        (u.teach_skills && u.teach_skills.some(s => s.toLowerCase().includes(q))) ||
        (u.learn_skills && u.learn_skills.some(s => s.toLowerCase().includes(q)))
      );
    }
    
    if (category) {
      result = result.filter(u => u.teach_skills && u.teach_skills.length > 0);
    }
    
    setFilteredUsers(result);
  }, [search, category, level, usersList]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">Search Students & Skills</h1>
          <p className="text-sm text-slate-500">Discover other users in the community with reciprocal skill exchange offers.</p>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills, name or keywords..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Category selection */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-indigo"
            >
              <option value="">All Categories</option>
              {MOCK_CATEGORIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Level selection */}
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-brand-indigo"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Grid Lists of User Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full p-12 bg-white text-center rounded-2xl border border-slate-100 text-slate-400">
              No matching profiles found. Try searching for different keywords!
            </div>
          ) : (
            filteredUsers.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* User Avatar & Title row */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"} 
                      alt={item.full_name} 
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-indigo/10"
                    />
                    <div>
                      <h3 className="font-bold text-slate-800 font-outfit">{item.full_name}</h3>
                      <p className="text-xs text-slate-400 font-semibold">{item.major}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                    <span>{item.rating_avg}</span>
                    <span className="text-slate-400 font-normal">({item.points} XP)</span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-500 line-clamp-2">{item.bio}</p>

                  {/* Skill Badge Lists */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-brand-emerald mb-1">Teaches</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.teach_skills.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-emerald-50 text-brand-emerald border border-brand-emerald/10 text-[10px] font-semibold rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-brand-indigo mb-1">Wants to Learn</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.learn_skills.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-indigo-50 text-brand-indigo border border-brand-indigo/10 text-[10px] font-semibold rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <button
                  onClick={() => navigate(`/profile?email=${item.email}`)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-brand-indigo hover:text-white border border-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  View Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
