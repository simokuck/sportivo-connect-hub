
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
  
  if (primaryColor) {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--sidebar-background', primaryColor);
  }
  
  if (secondaryColor) {
    document.documentElement.style.setProperty('--secondary', secondaryColor);
  }
  
  if (accentColor) {
    document.documentElement.style.setProperty('--accent', accentColor);
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
