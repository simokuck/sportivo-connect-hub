
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Calendar from './pages/Calendar';
import Exercises from './pages/Exercises';
import TrainingPlanner from './pages/TrainingPlanner';
import Teams from './pages/Teams';
import TeamMembers from './pages/TeamMembers';
import Documents from './pages/Documents';
import DevSettings from './pages/DevSettings';
import Warehouse from './pages/Warehouse';
import UserProfile from './pages/UserProfile';
import AuditLog from './pages/AuditLog';
import RolesAndPermissions from './pages/RolesAndPermissions';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

import VideoSessions from "./pages/VideoSessions";
import CompanyInfo from "./pages/CompanyInfo";

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="exercises" element={<Exercises />} />
                  <Route path="video-sessions" element={<VideoSessions />} />
                  <Route path="training-planner" element={<TrainingPlanner />} />
                  <Route path="teams" element={<Teams />} />
                  <Route path="team-members" element={<TeamMembers />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="medical" element={<div>Medical Area</div>} />
                  <Route path="dev-settings" element={<DevSettings />} />
                  <Route path="company-info" element={<CompanyInfo />} />
                  <Route path="warehouse" element={<Warehouse />} />
                  <Route path="user-profile" element={<UserProfile />} />
                  <Route path="audit-log" element={<AuditLog />} />
                  <Route path="roles-permissions" element={<RolesAndPermissions />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
