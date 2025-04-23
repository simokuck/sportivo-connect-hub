
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  storageKey?: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'theme'
}) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem(storageKey) as ThemeType;
    return savedTheme || defaultTheme;
  });
  
  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#1976d2';
  });
  
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };
  
  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
    
    // Aggiorniamo direttamente le variabili CSS
    document.documentElement.style.setProperty('--primary', convertHexToHSL(color));
    
    // Applichiamo il colore primario anche alla sidebar
    const sidebarElements = document.querySelectorAll('[style*="background-color"]');
    sidebarElements.forEach(element => {
      if ((element as HTMLElement).classList.contains('z-40') || (element as HTMLElement).getAttribute('style')?.includes('sportivo-blue')) {
        (element as HTMLElement).style.backgroundColor = color;
      }
    });
    
    // Forziamo un aggiornamento dei colori in tutto il CSS
    document.body.style.setProperty('--trigger-force-update', Date.now().toString());
    
    // Force a style refresh to update styles across the app
    forceStyleRefresh();
  };

  // Convertire un colore esadecimale in formato HSL per CSS variables
  const convertHexToHSL = (hex: string): string => {
    // Rimuovi il # se presente
    hex = hex.replace(/^#/, '');
    
    // Converti hex in RGB
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;
    
    // Trova max e min
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
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
    // Imposta la variabile CSS per il colore primario
    document.documentElement.style.setProperty('--primary', convertHexToHSL(primaryColor));
    
    // Applica il colore alla sidebar
    const applyColorToSidebar = () => {
      setTimeout(() => {
        const sidebarElements = document.querySelectorAll('aside');
        sidebarElements.forEach(element => {
          if ((element as HTMLElement).classList.contains('z-40')) {
            (element as HTMLElement).style.backgroundColor = primaryColor;
          }
        });
      }, 100);
    };
    
    applyColorToSidebar();
    
    window.addEventListener('resize', applyColorToSidebar);
    
    return () => {
      window.removeEventListener('resize', applyColorToSidebar);
    };
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
