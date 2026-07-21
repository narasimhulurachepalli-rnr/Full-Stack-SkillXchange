import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Share2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error?.detail || result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row font-sans">
      {/* Left split graphic illustration */}
      <div className="lg:w-1/2 flex flex-col justify-between p-12 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b,transparent_60%)]"></div>
        
        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-brand-indigo flex items-center justify-center text-white">
            <Share2 className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold font-outfit text-white">
            Skill<span className="text-brand-indigo">Xchange</span>
          </span>
        </Link>

        {/* Motivate quote */}
        <div className="space-y-6 relative z-10 max-w-lg mt-24 lg:mt-0">
          <h2 className="text-3xl lg:text-4xl font-bold font-outfit text-white leading-tight">
            Learn new skills directly from your peers.
          </h2>
          <p className="text-slate-400">
            Join the decentralized community of learners sharing skills without any financial burdens. Connect, negotiate, schedule, and grow.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-600 relative z-10">
          &copy; {new Date().getFullYear()} SkillXchange. Designed for community growth.
        </div>
      </div>

      {/* Right split form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white font-outfit">Welcome Back!</h1>
            <p className="text-sm text-slate-400">Login to continue managing your exchange connections</p>
          </div>

          {error && (
            <div className="p-4 bg-brand-rose/10 border border-brand-rose/30 text-brand-rose text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-indigo hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/20 transition-all active:scale-95 duration-200 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-600 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} })}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-800 text-sm text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.46 5.46 0 0 1 8.5 12.07a5.46 5.46 0 0 1 5.49-5.46c2.2 0 4.008 1.185 4.887 2.923l2.845-2.203C20.177 4.545 17.273 3 13.99 3A9.07 9.07 0 0 0 5 12.07a9.07 9.07 0 0 0 8.99 9.07c5.127 0 8.78-3.535 8.78-8.885c0-.608-.057-1.127-.17-1.57H12.24z"/></svg>
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSubmit({ preventDefault: () => {} })}
              className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-800 text-sm text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.9-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.9 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              <span>GitHub</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-500">
            Don't have an account? <Link to="/register" className="text-brand-indigo font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
