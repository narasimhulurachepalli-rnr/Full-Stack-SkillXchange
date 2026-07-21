import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  ArrowRight, BookOpen, MessageSquare, Calendar, 
  Star, Trophy, ShieldCheck, Heart, Sparkles 
} from 'lucide-react';
import { MOCK_CATEGORIES } from '../utils/mockData';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col font-sans selection:bg-brand-indigo selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-8 overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            {/* Tagline badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-indigo/10 text-brand-indigo rounded-full text-xs font-bold font-outfit">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering Community Learning
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight text-slate-900 leading-tight">
              Exchange Skills.<br />
              <span className="text-brand-indigo">Build Connections.</span><br />
              Grow Together.
            </h1>
            
            <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0">
              A premium, completely payment-free peer learning community. Share what you excel at, find peers teaching what you want to learn, and trade knowledge directly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-brand-indigo/25 transition-all active:scale-95 duration-200">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 flex items-center justify-center transition-all">
                Learn More
              </a>
            </div>
          </div>

          {/* Graphics illustration */}
          <div className="lg:w-1/2 relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 flex items-center justify-center shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" 
                alt="Students studying" 
                className="w-full h-full object-cover rounded-2xl shadow-lg border border-white/40"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                  <Star className="w-5 h-5 fill-brand-teal" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">4.8 Avg Rating</p>
                  <p className="text-xs text-slate-500">From trusted students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-brand-indigo">500+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-brand-indigo">1200+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Skills Listed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-brand-indigo">3000+</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Sessions Held</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-brand-indigo">100%</p>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Free Swap</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold font-outfit text-slate-900">How SkillXchange Works</h2>
            <p className="text-slate-500">Three simple steps to teach what you know and learn what you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900">List Your Skills</h3>
              <p className="text-sm text-slate-500">
                Create a profile, list the skills you know (teachables) and the skills you want to pick up (learnables).
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900">Propose & Chat</h3>
              <p className="text-sm text-slate-500">
                Search students, find matches, negotiate detail schedules inside in-app chat rooms, and trigger requests.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-3xl space-y-6 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900">Swap & Review</h3>
              <p className="text-sm text-slate-500">
                Hold structured online/offline learning sessions. Confirm completion and rate each other to build points!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-20 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold font-outfit text-slate-900">Explore Skill Categories</h2>
            <p className="text-slate-500">Discover hundreds of topics shared by your neighbors and community.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MOCK_CATEGORIES.map((cat) => (
              <div key={cat.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <h3 className="font-bold text-slate-900 font-outfit mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
