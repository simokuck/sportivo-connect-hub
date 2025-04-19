
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Documents from './pages/Documents';
import Teams from './pages/Teams';
import TeamMembers from './pages/TeamMembers';
import Statistics from './pages/Statistics';
import Medical from './pages/Medical';
import DevSettings from './pages/DevSettings';
import CompanyInfo from './pages/CompanyInfo';
import Warehouse from './pages/Warehouse';
import Exercises from './pages/Exercises';
import VideoSessions from './pages/VideoSessions';
import TrainingPlanner from './pages/TrainingPlanner';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import Developer from './pages/Developer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './hooks/use-toast';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <ToastProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/calendar"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Calendar />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/documents"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Documents />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/teams"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Teams />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/team-members"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <TeamMembers />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/statistics"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Statistics />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/medical"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Medical />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/dev-settings"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <DevSettings />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/company-info"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <CompanyInfo />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/warehouse"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Warehouse />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/exercises"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Exercises />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/video-sessions"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <VideoSessions />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/training-planner"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <TrainingPlanner />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </AuthGuard>
                }
              />
              <Route
                path="/developer"
                element={
                  <AuthGuard>
                    <AppLayout>
                      <Developer />
                    </AppLayout>
                  </AuthGuard>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
