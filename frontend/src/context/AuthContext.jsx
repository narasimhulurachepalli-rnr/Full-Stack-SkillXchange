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

  const login = (email, password) => {
    setIsLoading(true);
    try {
      let loggedUser = null;
      try {
        const list = JSON.parse(localStorage.getItem('skillxchange_all_users') || '[]');
        const found = list.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
        if (found && found.user) loggedUser = found.user;
      } catch (e) {}

      if (!loggedUser) {
        loggedUser = {
          ...mockUser,
          id: "user-" + Date.now(),
          email: email,
          full_name: email.includes('@') ? email.split('@')[0].toUpperCase() : email,
          credits: 1,
          is_verified: true
        };
      }

      setUser(loggedUser);
      setTokens({ access: "token_" + Date.now(), refresh: "ref_" + Date.now() });
      setIsAuthenticated(true);

      try {
        localStorage.setItem('skillxchange_user', JSON.stringify(loggedUser));
        localStorage.setItem('skillxchange_tokens', JSON.stringify({ access: "token_" + Date.now(), refresh: "ref_" + Date.now() }));
      } catch (e) {}

      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const register = (fullName, email, password, avatar = null) => {
    setIsLoading(true);
    try {
      const newUser = {
        id: "user-" + Date.now(),
        email: email,
        full_name: fullName,
        bio: "Passionate learner trading skills on SkillXchange.",
        phone: "+91 9876543210",
        major: "Student - SkillXchange",
        teach_skills: ["React JS", "Python", "JavaScript"],
        learn_skills: ["UI/UX Design", "Communication"],
        rating_avg: 5.0,
        points: 100,
        credits: 1,
        credit_history: [
          {
            id: "tx-" + Date.now(),
            type: "WELCOME_BONUS",
            amount: 1,
            description: "Welcome Skill Credit Bonus (New Account)",
            created_at: new Date().toISOString()
          }
        ],
        avatar: avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        role: "User",
        is_verified: true
      };

      setUser(newUser);
      setTokens({ access: "token_" + Date.now(), refresh: "ref_" + Date.now() });
      setIsAuthenticated(true);

      try {
        localStorage.setItem('skillxchange_user', JSON.stringify(newUser));
        localStorage.setItem('skillxchange_tokens', JSON.stringify({ access: "token_" + Date.now(), refresh: "ref_" + Date.now() }));
        const list = JSON.parse(localStorage.getItem('skillxchange_all_users') || '[]');
        list.push({ email: email.toLowerCase(), password, user: newUser });
        localStorage.setItem('skillxchange_all_users', JSON.stringify(list));
      } catch (e) {
        console.warn("Storage notice:", e);
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: "Registration error" };
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
      if (tokens && tokens.access && tokens.access !== "mock") {
        const response = await axios.put(`${API_BASE_URL}/auth/profile/`, profileData, {
          headers: { Authorization: `Bearer ${tokens.access}` },
          timeout: 4000
        });
        setUser(response.data);
        localStorage.setItem('skillxchange_user', JSON.stringify(response.data));
      } else {
        const updated = { ...user, ...profileData };
        setUser(updated);
        localStorage.setItem('skillxchange_user', JSON.stringify(updated));
      }
      return { success: true };
    } catch (error) {
      console.error("Profile update notice:", error);
      const updated = { ...user, ...profileData };
      setUser(updated);
      localStorage.setItem('skillxchange_user', JSON.stringify(updated));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, isAuthenticated, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
