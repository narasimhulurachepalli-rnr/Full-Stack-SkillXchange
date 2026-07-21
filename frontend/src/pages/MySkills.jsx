import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Plus, Trash2, Sparkles, CheckCircle2, AlertCircle, Tag, Award } from 'lucide-react';

const POPULAR_TEACH_SKILLS = [
  "React JS", "Python", "JavaScript", "Java", "C++", 
  "HTML & CSS", "Data Structures", "UI/UX Design", "SQL", 
  "Photoshop", "Video Editing", "Public Speaking", "Spoken English"
];

const POPULAR_LEARN_SKILLS = [
  "UI/UX Design", "Figma", "Machine Learning", "Django", 
  "French", "German", "Guitar", "Yoga", "Financial Literacy", 
  "Digital Marketing", "Cooking", "Content Writing", "Flutter"
];

export default function MySkills() {
  const { user, updateProfile } = useAuth();
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const teachSkills = user?.teach_skills || [];
  const learnSkills = user?.learn_skills || [];

  const handleAddTeach = (skillToAdd) => {
    setErrorMsg('');
    setSuccessMsg('');
    const skillName = (typeof skillToAdd === 'string' ? skillToAdd : newTeach).trim();
    
    if (!skillName) return;

    if (teachSkills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      setErrorMsg(`"${skillName}" is already in your Teach skills catalog.`);
      return;
    }

    const updated = [...teachSkills, skillName];
    updateProfile({ teach_skills: updated });
    setNewTeach('');
    setSuccessMsg(`Added "${skillName}" to your Teach skills!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddLearn = (skillToAdd) => {
    setErrorMsg('');
    setSuccessMsg('');
    const skillName = (typeof skillToAdd === 'string' ? skillToAdd : newLearn).trim();
    
    if (!skillName) return;

    if (learnSkills.some(s => s.toLowerCase() === skillName.toLowerCase())) {
      setErrorMsg(`"${skillName}" is already in your Learn skills catalog.`);
      return;
    }

    const updated = [...learnSkills, skillName];
    updateProfile({ learn_skills: updated });
    setNewLearn('');
    setSuccessMsg(`Added "${skillName}" to your Learn skills!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteTeach = (skill) => {
    setErrorMsg('');
    setSuccessMsg('');
    const updated = teachSkills.filter(s => s !== skill);
    updateProfile({ teach_skills: updated });
    setSuccessMsg(`Removed "${skill}" from your Teach skills.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteLearn = (skill) => {
    setErrorMsg('');
    setSuccessMsg('');
    const updated = learnSkills.filter(s => s !== skill);
    updateProfile({ learn_skills: updated });
    setSuccessMsg(`Removed "${skill}" from your Learn skills.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16 font-sans max-w-full overflow-hidden">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-3xl text-white shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-72 bg-brand-indigo/10 rounded-full blur-3xl -z-0"></div>
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-indigo/30 border border-brand-indigo/40 rounded-full text-[11px] font-semibold text-brand-indigo">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Skill Profile Manager</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit tracking-tight">My Skill Catalog</h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Add skills you can teach to others, and skills you want to learn in exchange.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl self-start sm:self-auto">
            <div className="text-center px-3 sm:px-4 border-r border-slate-800">
              <p className="text-xl sm:text-2xl font-bold font-outfit text-brand-emerald">{teachSkills.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Teaching</p>
            </div>
            <div className="text-center px-3 sm:px-4">
              <p className="text-xl sm:text-2xl font-bold font-outfit text-brand-indigo">{learnSkills.length}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Learning</p>
            </div>
          </div>
        </div>

        {/* Global Feedback Notifications */}
        {errorMsg && (
          <div className="p-3.5 bg-brand-rose/10 border border-brand-rose/30 text-brand-rose text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs sm:text-sm rounded-xl flex items-center gap-2.5 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* SECTION 1: TEACHING SKILLS */}
          <div className="bg-white border border-slate-200/80 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-outfit text-slate-900">Skills I Can Teach</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">Skills you offer to coach others</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] sm:text-xs rounded-full border border-emerald-200 flex-shrink-0">
                {teachSkills.length} Listed
              </span>
            </div>

            {/* Mobile Responsive Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddTeach(newTeach); }} className="flex gap-2">
              <input
                type="text"
                value={newTeach}
                onChange={(e) => setNewTeach(e.target.value)}
                placeholder="Type skill (e.g. Python, Yoga)..."
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Popular Quick Add Tags Bar */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Quick Add Popular Teach Skills:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {POPULAR_TEACH_SKILLS.map((skill) => {
                  const isAdded = teachSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => !isAdded && handleAddTeach(skill)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200/60'
                      }`}
                    >
                      {isAdded ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current List */}
            <div className="space-y-2.5 pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Teachable List</h3>
              {teachSkills.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-1.5">
                  <BookOpen className="w-7 h-7 text-slate-300 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">No teach skills added yet</p>
                  <p className="text-[11px] text-slate-400">Type a skill above or click any tag to list it on your profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {teachSkills.map((skill) => (
                    <div 
                      key={skill} 
                      className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-50/60 to-slate-50 border border-emerald-100 rounded-xl flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">{skill}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteTeach(skill)} 
                        title="Remove skill"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: LEARNING SKILLS */}
          <div className="bg-white border border-slate-200/80 p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-brand-indigo" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-outfit text-slate-900">Skills I Want to Learn</h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">Skills you wish to acquire</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full border border-indigo-200 flex-shrink-0">
                {learnSkills.length} Listed
              </span>
            </div>

            {/* Mobile Responsive Input Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleAddLearn(newLearn); }} className="flex gap-2">
              <input
                type="text"
                value={newLearn}
                onChange={(e) => setNewLearn(e.target.value)}
                placeholder="Type skill (e.g. Figma, French)..."
                className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-indigo focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-brand-indigo hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Popular Quick Add Tags Bar */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" /> Quick Add Popular Learn Skills:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {POPULAR_LEARN_SKILLS.map((skill) => {
                  const isAdded = learnSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => !isAdded && handleAddLearn(skill)}
                      disabled={isAdded}
                      className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                        isAdded 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                          : 'bg-indigo-50 text-indigo-700 hover:bg-brand-indigo hover:text-white border border-indigo-200/60'
                      }`}
                    >
                      {isAdded ? <CheckCircle2 className="w-3 h-3 text-indigo-600" /> : <Plus className="w-3 h-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current List */}
            <div className="space-y-2.5 pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Learnable List</h3>
              {learnSkills.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-1.5">
                  <BookOpen className="w-7 h-7 text-slate-300 mx-auto" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">No learn skills added yet</p>
                  <p className="text-[11px] text-slate-400">Type a skill above or click any tag to list it on your wishlist.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {learnSkills.map((skill) => (
                    <div 
                      key={skill} 
                      className="px-3.5 py-2.5 bg-gradient-to-r from-indigo-50/60 to-slate-50 border border-indigo-100 rounded-xl flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-2 h-2 rounded-full bg-brand-indigo flex-shrink-0"></span>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">{skill}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteLearn(skill)} 
                        title="Remove skill"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all flex-shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
