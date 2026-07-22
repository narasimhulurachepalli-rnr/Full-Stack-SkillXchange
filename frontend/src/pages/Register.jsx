import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  cropToSquareBase64, validateImageFile, DEFAULT_AVATAR 
} from '../utils/imageUtils';
import { Share2, Mail, Lock, User, ArrowRight, Camera, Upload, Trash2 } from 'lucide-react';

export default function Register() {
  const { register, updateProfile } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Proactively warm up backend container and MongoDB Atlas connection
    api.pingServer();
  }, []);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      const croppedBase64 = await cropToSquareBase64(file, 256);
      setAvatar(croppedBase64);
    } catch (err) {
      setError(err.message || 'Failed to process photo.');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setError('You must accept the Terms and Conditions.');
      return;
    }

    setLoading(true);
    try {
      const result = await register(fullName, email, password, avatar);
      if (result && result.success) {
        navigate('/dashboard');
      } else {
        setError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration encountered an error. Please try again.');
    } finally {
      setLoading(false);
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
            Share your expertise. Acquire new abilities.
          </h2>
          <p className="text-slate-400">
            A verified hub where skills are exchanged purely. Set up your learning profile, list your teachables, and discover matching community tutors.
          </p>
        </div>

        {/* Footer info */}
        <div className="text-xs text-slate-600 relative z-10">
          &copy; {new Date().getFullYear()} SkillXchange. Designed for community growth.
        </div>
      </div>

      {/* Right split form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-6 bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white font-outfit">Create Account</h1>
            <p className="text-sm text-slate-400">Join SkillXchange today and explore skills</p>
          </div>

          {error && (
            <div className="p-4 bg-brand-rose/10 border border-brand-rose/30 text-brand-rose text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Optional Profile Photo Picker */}
            <div className="flex items-center gap-4 p-3 bg-slate-900 border border-slate-800 rounded-2xl">
              <img src={avatar || DEFAULT_AVATAR} alt="Avatar preview" className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-slate-300">Profile Photo (Optional)</p>
                <p className="text-[10px] text-slate-500">JPG, PNG, WebP &bull; Max 5 MB</p>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/jpeg,image/jpg,image/png,image/webp" 
                onChange={handlePhotoSelect} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nandini R"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/10 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded text-brand-indigo bg-slate-900 border-slate-800 focus:ring-brand-indigo/35"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the <a href="#" className="text-brand-indigo hover:underline">Terms & Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-indigo hover:bg-brand-indigo/90 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/20 transition-all active:scale-95 duration-200 mt-4 cursor-pointer"
            >
              {loading ? (
                <span>Registering &amp; Syncing Atlas DB...</span>
              ) : (
                <>
                  <span>Register</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account? <Link to="/login" className="text-brand-indigo font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
