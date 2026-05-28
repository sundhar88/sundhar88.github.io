/**
 * useTheme — manages dark/light theme & accent colors
 */
import { useState, useEffect, useCallback } from 'react';

const COLOR_MAP = {
  dark: {
    mono: '#FFFFFF', yellow: '#FFB000', green: '#00FF41', red: '#FF4D4D',
    cyan: '#00FFFF', blue: '#6699FF', purple: '#D1A3FF', pink: '#FF80BF',
  },
  light: {
    mono: '#000000', yellow: '#805E00', green: '#00661A', red: '#B30000',
    cyan: '#006666', blue: '#0033CC', purple: '#7A29CC', pink: '#B8005D',
  },
};

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || getSystemTheme());
  const [accent, setAccent] = useState(() => sessionStorage.getItem('accentColor') || 'mono');

  const applyTheme = useCallback((newTheme, newAccent) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    const color = COLOR_MAP[newTheme][newAccent];
    document.documentElement.style.setProperty('--accent', color);

    // Compute RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0,2),16);
    const g = parseInt(hex.slice(2,4),16);
    const b = parseInt(hex.slice(4,6),16);
    document.documentElement.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
  }, []);

  useEffect(() => {
    applyTheme(theme, accent);
  }, [theme, accent, applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    // Flash overlay
    const overlay = document.querySelector('.theme-overlay');
    if (overlay) {
      overlay.classList.remove('animating');
      void overlay.offsetWidth;
      overlay.classList.add('animating');
    }
  }, [theme]);

  const changeAccent = useCallback((colorKey) => {
    sessionStorage.setItem('accentColor', colorKey);
    setAccent(colorKey);
  }, []);

  // Sync with OS preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { theme, accent, toggleTheme, changeAccent, colorMap: COLOR_MAP };
}
