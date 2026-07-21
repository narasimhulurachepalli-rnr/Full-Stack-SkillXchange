import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages import
import Splash from './pages/Splash';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerify from './pages/EmailVerify';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import UserProfile from './pages/UserProfile';
import SkillDetails from './pages/SkillDetails';
import MySkills from './pages/MySkills';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import Sessions from './pages/Sessions';
import VideoRoom from './pages/VideoRoom';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

// Route Guard Wrapper for Private Pages
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p className="text-sm font-semibold uppercase tracking-widest animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/" element={<Splash />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/email-verify" element={<EmailVerify />} />

          {/* Protected Dashboard Workspace routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/skill-details" element={<PrivateRoute><SkillDetails /></PrivateRoute>} />
          <Route path="/my-skills" element={<PrivateRoute><MySkills /></PrivateRoute>} />
          <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
          <Route path="/video-session/:sessionId" element={<PrivateRoute><VideoRoom /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
          <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
