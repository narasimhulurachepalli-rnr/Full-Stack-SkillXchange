import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const THEME_PRESETS = [
  { id: 'light', name: 'Light Slate', bg: 'bg-slate-50', text: 'text-slate-900', cardBg: 'bg-white', border: 'border-slate-200' },
  { id: 'dark', name: 'Dark Mode', bg: 'bg-slate-950', text: 'text-white', cardBg: 'bg-slate-900', border: 'border-slate-800' },
  { id: 'amoled', name: 'AMOLED Black', bg: 'bg-black', text: 'text-white', cardBg: 'bg-zinc-950', border: 'border-zinc-800' },
  { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-950', text: 'text-purple-50', cardBg: 'bg-purple-900/40', border: 'border-purple-800/50' },
  { id: 'blue', name: 'Deep Blue', bg: 'bg-slate-900', text: 'text-blue-50', cardBg: 'bg-blue-950/60', border: 'border-blue-800/40' },
  { id: 'green', name: 'Emerald Forest', bg: 'bg-emerald-950', text: 'text-emerald-50', cardBg: 'bg-emerald-900/40', border: 'border-emerald-800/50' },
  { id: 'orange', name: 'Sunset Amber', bg: 'bg-stone-950', text: 'text-amber-50', cardBg: 'bg-amber-950/30', border: 'border-amber-900/40' },
  { id: 'pink', name: 'Rose Midnight', bg: 'bg-rose-950', text: 'text-rose-50', cardBg: 'bg-rose-900/30', border: 'border-rose-900/40' },
];

export const ACCENT_COLORS = [
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Sky Blue', hex: '#3B82F6' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Teal', hex: '#14B8A6' },
];

export const FONT_SIZES = [
  { id: 'small', label: 'Small', base: '14px' },
  { id: 'medium', label: 'Medium (Default)', base: '16px' },
  { id: 'large', label: 'Large', base: '18px' },
];

export const BORDER_RADII = [
  { id: 'sharp', label: 'Sharp (0px)', value: '0px' },
  { id: 'rounded', label: 'Rounded (12px)', value: '12px' },
  { id: 'extra', label: 'Pill / Extra (24px)', value: '24px' },
];

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [fontSize, setFontSize] = useState('medium');
  const [borderRadius, setBorderRadius] = useState('extra');
  const [cardStyle, setCardStyle] = useState('bordered');

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('skillxchange_theme_prefs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.themeMode) setThemeMode(parsed.themeMode);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.borderRadius) setBorderRadius(parsed.borderRadius);
        if (parsed.cardStyle) setCardStyle(parsed.cardStyle);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    // Dynamically update document root attributes and CSS variables
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.style.setProperty('--brand-accent', accentColor);
    
    const fontBase = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    root.style.setProperty('--app-font-size', fontBase);
    
    const radiusVal = borderRadius === 'sharp' ? '0px' : borderRadius === 'rounded' ? '12px' : '24px';
    root.style.setProperty('--app-border-radius', radiusVal);

    // Save preferences locally
    localStorage.setItem('skillxchange_theme_prefs', JSON.stringify({
      themeMode,
      accentColor,
      fontSize,
      borderRadius,
      cardStyle
    }));
  }, [themeMode, accentColor, fontSize, borderRadius, cardStyle]);

  const updateTheme = (newSettings) => {
    if (newSettings.themeMode) setThemeMode(newSettings.themeMode);
    if (newSettings.accentColor) setAccentColor(newSettings.accentColor);
    if (newSettings.fontSize) setFontSize(newSettings.fontSize);
    if (newSettings.borderRadius) setBorderRadius(newSettings.borderRadius);
    if (newSettings.cardStyle) setCardStyle(newSettings.cardStyle);
  };

  return (
    <ThemeContext.Provider value={{
      themeMode,
      accentColor,
      fontSize,
      borderRadius,
      cardStyle,
      setThemeMode,
      setAccentColor,
      setFontSize,
      setBorderRadius,
      setCardStyle,
      updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
