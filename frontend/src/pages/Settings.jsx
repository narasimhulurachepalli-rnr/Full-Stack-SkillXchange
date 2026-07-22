import React, { useState, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { 
  useTheme, THEME_PRESETS, ACCENT_COLORS, FONT_SIZES, BORDER_RADII 
} from '../context/ThemeContext';
import { 
  cropToSquareBase64, validateImageFile, DEFAULT_AVATAR 
} from '../utils/imageUtils';
import { Palette, Check, Sparkles, Upload, Trash2, Camera, AlertCircle, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { 
    themeMode, setThemeMode, 
    accentColor, setAccentColor, 
    fontSize, setFontSize, 
    borderRadius, setBorderRadius 
  } = useTheme();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.full_name || 'Nandini R');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [major, setMajor] = useState(user?.major || '');
  const [avatar, setAvatar] = useState(user?.avatar || DEFAULT_AVATAR);
  const [success, setSuccess] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setPhotoError(validation.error);
      return;
    }

    try {
      setPhotoLoading(true);
      const croppedBase64 = await cropToSquareBase64(file, 256);
      setAvatar(croppedBase64);
      // Immediately trigger update to context & localStorage
      await updateProfile({ avatar: croppedBase64 });
      setPhotoLoading(false);
    } catch (err) {
      setPhotoLoading(false);
      setPhotoError(err.message || 'Failed to process image file.');
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoError('');
    setAvatar(DEFAULT_AVATAR);
    await updateProfile({ avatar: DEFAULT_AVATAR });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({
      full_name: name,
      bio,
      phone,
      major,
      avatar,
      theme_preferences: {
        themeMode,
        accentColor,
        fontSize,
        borderRadius
      }
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in font-sans">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-outfit text-slate-800">Account & Theme Settings</h1>
          <p className="text-sm text-slate-500">Personalize your profile photo, app colors, themes, font sizes, and credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form 1: Account Profile Information */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold font-outfit text-slate-800 border-b border-slate-100 pb-3">
              Profile Credentials & Photo
            </h2>

            {success && (
              <div className="p-4 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-sm rounded-xl">
                Profile photo and settings saved successfully!
              </div>
            )}

            {photoError && (
              <div className="p-4 bg-brand-rose/10 border border-brand-rose/20 text-brand-rose text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo Manager */}
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6">
                <div className="relative">
                  <img 
                    src={avatar || DEFAULT_AVATAR} 
                    alt="Profile photo" 
                    className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-100 shadow-md" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 bg-brand-indigo text-white rounded-xl shadow-lg hover:scale-105 transition-transform"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <h3 className="font-bold text-slate-800 text-sm font-outfit">Profile Picture</h3>
                  <p className="text-xs text-slate-400">JPG, JPEG, PNG or WebP. Max 5 MB. Auto-cropped to square.</p>
                  
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                    <button
                      type="button"
                      disabled={photoLoading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-brand-indigo text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-indigo/90 shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {photoLoading ? "Processing..." : (avatar && avatar !== DEFAULT_AVATAR ? "Replace Photo" : "Upload Photo")}
                    </button>

                    {avatar && avatar !== DEFAULT_AVATAR && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3.5 py-1.5 bg-slate-100 text-brand-rose border border-brand-rose/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-brand-rose/5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-indigo"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department / Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. CSE - 3rd Year"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-brand-indigo hover:bg-brand-indigo/90 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-indigo/15 active:scale-95 transition-all"
              >
                Save All Changes
              </button>
            </form>
          </div>

          {/* Form 2: Theme Customization Engine */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold font-outfit text-slate-800 flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-indigo" />
                Theme Customization Engine
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-brand-indigo px-2.5 py-1 rounded-full">
                Instant Live
              </span>
            </div>

            {/* 1. Theme Presets Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">1. Select App Theme (8 Presets)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setThemeMode(preset.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${preset.bg} ${preset.border} ${
                      themeMode === preset.id ? 'ring-2 ring-brand-indigo scale-105 shadow-md' : 'hover:scale-102'
                    }`}
                  >
                    <span className={`text-[11px] font-bold ${preset.text}`}>{preset.name}</span>
                    {themeMode === preset.id && (
                      <span className="self-end p-1 bg-brand-indigo text-white rounded-full">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Custom Accent Colors */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">2. Accent Brand Color</label>
              <div className="flex flex-wrap gap-3">
                {ACCENT_COLORS.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setAccentColor(col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`w-9 h-9 rounded-2xl shadow-sm flex items-center justify-center transition-all ${
                      accentColor === col.hex ? 'ring-4 ring-slate-300 scale-110' : 'hover:scale-105'
                    }`}
                    title={col.name}
                  >
                    {accentColor === col.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Font Size Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">3. Typography Base Size</label>
              <div className="grid grid-cols-3 gap-2">
                {FONT_SIZES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontSize(f.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      fontSize === f.id
                        ? 'bg-brand-indigo text-white border-brand-indigo shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Border Radius Customization */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">4. Card & Button Corner Style</label>
              <div className="grid grid-cols-3 gap-2">
                {BORDER_RADII.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setBorderRadius(r.id)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      borderRadius === r.id
                        ? 'bg-brand-indigo text-white border-brand-indigo shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Dedicated Log Out Card */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-rose-900 font-outfit">Log Out of Account</h3>
            <p className="text-xs text-rose-600">Sign out of your active SkillXchange session on this device.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
