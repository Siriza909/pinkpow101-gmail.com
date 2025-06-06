import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { Theme } from '../types';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('appTheme') as Theme | null;
      if (savedTheme && (savedTheme === 'orange-dark' || savedTheme === 'light')) {
        return savedTheme;
      }
      // Default to orange-dark if no theme is saved
    }
    return 'orange-dark'; 
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appTheme', theme);
      const root = document.documentElement;
      
      root.classList.remove('orange-dark', 'light'); // Remove previous theme class
      root.classList.add(theme); // Add current theme class
      
      // CSS variables in index.html will now apply based on the html.light or default :root styles
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'orange-dark' : 'light'));
  };

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]); // Removed toggleTheme from dependencies as it doesn't change

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};