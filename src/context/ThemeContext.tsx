
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    return savedTheme || 'system';
  });
  
  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#1976d2';
  });
  
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Add CSS variables for hover state
    const lighterColor = adjustColorBrightness(color, 0.85);
    document.documentElement.style.setProperty('--primary-color-hover', lighterColor);
    
    // Force a style refresh to update styles across the app
    forceStyleRefresh();
  };

  // Apply the theme based on user preference or system preference
  useEffect(() => {
    // Handle the system theme preference
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const isDark = e.matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    };
    
    // Apply the correct theme
    const applyTheme = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };
    
    const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Apply theme immediately
    applyTheme();
    
    return () => {
      systemThemeMediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);
  
  // Apply the primary color when the app loads
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    const lighterColor = adjustColorBrightness(primaryColor, 0.85);
    document.documentElement.style.setProperty('--primary-color-hover', lighterColor);
  }, [primaryColor]);
  
  // Force a refresh of the styles by temporarily modifying the DOM
  const forceStyleRefresh = () => {
    // Add a temporary element to force style recalculation
    const tempElement = document.createElement('div');
    document.body.appendChild(tempElement);
    // Force reflow
    window.getComputedStyle(tempElement).getPropertyValue('opacity');
    // Remove the element
    document.body.removeChild(tempElement);
  };
  
  // Utility function to adjust color brightness
  const adjustColorBrightness = (color: string, factor: number): string => {
    // Convert hex to RGB
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);
    
    // Adjust brightness
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
