import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Share2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EmailVerify() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, updateProfile } = useAuth();
  const [cooldown, setCooldown] = useState(0);

  const handleGoToDashboard = async () => {
    try {
      if (isAuthenticated && user) {
        await updateProfile({ is_verified: true });
      }
    } catch (e) {
      console.warn("Auth update profile notice:", e);
    }
    navigate('/dashboard');
  };

  const handleResend = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl space-y-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b,transparent_65%)]"></div>

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center animate-pulse">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white font-outfit">Verify Your Email</h1>
          <p className="text-sm text-slate-400 max-w-sm">
            We have sent a verification link to <span className="text-white font-semibold">{user?.email || "nandini@email.com"}</span>. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          <button
            type="button"
            onClick={handleGoToDashboard}
            className="w-full py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/20 transition-all active:scale-95 duration-200 cursor-pointer"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-col gap-2">
            <button
              disabled={cooldown > 0}
              onClick={handleResend}
              className="text-xs font-semibold text-brand-indigo hover:underline disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend Email in (${cooldown}s)` : "Didn't receive the email? Resend Email"}
            </button>
            <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-white hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
