
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import NotFound from './pages/NotFound';
import Statistics from './pages/Statistics';
import Teams from './pages/Teams';
import Calendar from './pages/Calendar';
import Exercises from './pages/Exercises';
import Documents from './pages/Documents';
import TrainingPlanner from './pages/TrainingPlanner';
import UserProfile from './pages/UserProfile';
import DevSettings from './pages/DevSettings';
import TeamMembers from './pages/TeamMembers';
import './App.css';
import { Toaster } from './components/ui/sonner';
import Warehouse from './pages/Warehouse';
import { NotificationProvider } from './context/NotificationContext';

// Initialize theme colors from localStorage if available
const initializeTheme = () => {
  const primaryColor = localStorage.getItem('theme-primary-color');
  const secondaryColor = localStorage.getItem('theme-secondary-color');
  const accentColor = localStorage.getItem('theme-accent-color');
  
  // Convert HEX to HSL for CSS variables
  const hexToHSL = (hex: string) => {
    if (!hex) return null;
    
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;
    
    // Find the min and max values to calculate the lightness
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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
    
    // Convert saturation and lightness to percentages
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return { h, s, l };
  };
  
  if (primaryColor) {
    const hsl = hexToHSL(primaryColor);
    if (hsl) {
      document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
      document.documentElement.style.setProperty('--sidebar-background', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }
  }
  
  if (secondaryColor) {
    const hsl = hexToHSL(secondaryColor);
    if (hsl) {
      document.documentElement.style.setProperty('--secondary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      document.documentElement.style.setProperty('--secondary-foreground', '0 0% 100%');
    }
  }
  
  if (accentColor) {
    const hsl = hexToHSL(accentColor);
    if (hsl) {
      document.documentElement.style.setProperty('--accent', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      document.documentElement.style.setProperty('--accent-foreground', '0 0% 100%');
    }
  }
};

// Call the initialization function
initializeTheme();

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen w-full bg-background">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="teams" element={<Teams />} />
              <Route path="team-members" element={<TeamMembers />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="exercises" element={<Exercises />} />
              <Route path="documents" element={<Documents />} />
              <Route path="training-planner" element={<TrainingPlanner />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="dev-settings" element={<DevSettings />} />
              <Route path="warehouse" element={<Warehouse />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
