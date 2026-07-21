import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Share2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b,transparent_65%)]"></div>

        <div className="flex flex-col items-center gap-2 relative z-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo mb-2">
            <Share2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white font-outfit">Forgot Password?</h1>
          <p className="text-sm text-slate-400">
            {submitted 
              ? `Check your inbox at ${email}` 
              : "No worries! Enter your email and we'll send you reset instructions."
            }
          </p>
        </div>

        {submitted ? (
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-sm rounded-xl text-center">
              We have sent a password reset link to your email address.
            </div>
            <Link
              to="/login"
              className="w-full py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nandini@email.com"
                  className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/20 transition-all active:scale-95 duration-200"
            >
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/login"
              className="w-full py-3 bg-slate-900/50 border border-slate-800/80 text-slate-400 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
