import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock profile data for instant fallback if API is not available or local development
  const mockUser = {
    id: "mock-nandini-id",
    email: "nandini@email.com",
    full_name: "Nandini R",
    bio: "Passionate learner and enthusiast about teaching and learning new skills.",
    phone: "+91 9876543210",
    major: "CSE - 3rd Year, MITS Madanapalle",
    teach_skills: ["Python", "C Programming", "Data Structures", "HTML", "CSS"],
    learn_skills: ["React JS", "Django", "UI/UX Design", "Machine Learning"],
    rating_avg: 4.6,
    points: 320,
    credits: 3,
    credit_history: [
      { id: "tx-1", type: "WELCOME_BONUS", amount: 1, description: "Welcome Skill Credit Bonus", created_at: "2026-07-01T10:00:00Z" },
      { id: "tx-2", type: "SESSION_REWARD", amount: 1, description: "Completed Python Class Swap", created_at: "2026-07-15T14:30:00Z" },
      { id: "tx-3", type: "REFERRAL_BONUS", amount: 1, description: "Community Contributor Reward", created_at: "2026-07-18T09:00:00Z" }
    ],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "User",
    is_verified: true
  };

  useEffect(() => {
    // Check local storage on startup
    const savedTokens = localStorage.getItem('skillxchange_tokens');
    const savedUser = localStorage.getItem('skillxchange_user');
    
    if (savedTokens && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Clear old mock user data from prior builds
        if (!parsedUser || parsedUser.id === "mock-nandini-id" || parsedUser.email === "nandini@email.com") {
          localStorage.removeItem('skillxchange_tokens');
          localStorage.removeItem('skillxchange_user');
          setUser(null);
          setTokens(null);
          setIsAuthenticated(false);
        } else {
          setTokens(JSON.parse(savedTokens));
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem('skillxchange_tokens');
        localStorage.removeItem('skillxchange_user');
        setUser(null);
        setTokens(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setTokens(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    const lowerEmail = (email || '').trim().toLowerCase();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        username: lowerEmail,
        password: password
      }, { timeout: 90000 });

      if (response.data && response.data.access) {
        const authTokens = { access: response.data.access, refresh: response.data.refresh };
        const profileUser = response.data.user;

        setUser(profileUser);
        setTokens(authTokens);
        setIsAuthenticated(true);

        localStorage.setItem('skillxchange_user', JSON.stringify(profileUser));
        localStorage.setItem('skillxchange_tokens', JSON.stringify(authTokens));

        return { success: true, user: profileUser };
      }
      return { success: false, error: response.data?.detail || "Invalid login credentials." };
    } catch (apiErr) {
      console.warn("Backend login API notice:", apiErr);
      const msg = apiErr.response?.data?.detail || apiErr.message || "Login failed to connect to backend server.";
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName, email, password, avatar = null) => {
    setIsLoading(true);
    const lowerEmail = (email || '').trim().toLowerCase();
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        full_name: fullName,
        email: lowerEmail,
        password: password,
        confirm_password: password,
        avatar: avatar || ""
      }, { timeout: 90000 });

      if (response.data && response.data.tokens) {
        const registeredUser = response.data.user;
        const authTokens = response.data.tokens;

        setUser(registeredUser);
        setTokens(authTokens);
        setIsAuthenticated(true);

        localStorage.setItem('skillxchange_user', JSON.stringify(registeredUser));
        localStorage.setItem('skillxchange_tokens', JSON.stringify(authTokens));

        return { success: true, user: registeredUser, atlas_id: response.data.atlas_document_id };
      }
      return { success: false, error: response.data?.detail || "Registration failed." };
    } catch (apiErr) {
      console.warn("Backend API registration notice:", apiErr);
      const msg = apiErr.response?.data?.detail || apiErr.message || "Registration failed to connect to backend server.";
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    setIsAuthenticated(false);
    localStorage.removeItem('skillxchange_tokens');
    localStorage.removeItem('skillxchange_user');
    window.location.href = '/login';
  };

  const updateProfile = async (profileData) => {
    try {
      let updated = { ...user, ...profileData };

      // Persistent API update directly to MongoDB Atlas
      if (tokens && tokens.access && tokens.access !== "mock" && !tokens.access.startsWith("token_")) {
        try {
          const res = await axios.put(`${API_BASE_URL}/auth/profile/`, profileData, {
            headers: { Authorization: `Bearer ${tokens.access}` },
            timeout: 60000
          });
          if (res.data) {
            updated = { ...updated, ...res.data };
          }
        } catch (apiErr) {
          console.warn("MongoDB profile update notice:", apiErr);
        }
      }

      setUser(updated);

      try {
        localStorage.setItem('skillxchange_user', JSON.stringify(updated));
        
        // Also sync in skillxchange_all_users list
        const list = JSON.parse(localStorage.getItem('skillxchange_all_users') || '[]');
        const userIndex = list.findIndex(u => u.email && u.email.toLowerCase() === (updated.email || '').toLowerCase());
        if (userIndex !== -1) {
          list[userIndex].user = updated;
          localStorage.setItem('skillxchange_all_users', JSON.stringify(list));
        }
      } catch (e) {}

      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: "Failed to update profile" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, isAuthenticated, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
