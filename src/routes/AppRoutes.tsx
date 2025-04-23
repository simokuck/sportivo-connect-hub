
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import Teams from '@/pages/Teams';
import TeamMembers from '@/pages/TeamMembers';
import Calendar from '@/pages/Calendar';
import Documents from '@/pages/Documents';
import Statistics from '@/pages/Statistics';
import Warehouse from '@/pages/Warehouse';
import TrainingPlanner from '@/pages/TrainingPlanner';
import VideoSessions from '@/pages/VideoSessions';
import CompanyInfo from '@/pages/CompanyInfo';
import AuditLog from '@/pages/AuditLog';
import RolesAndPermissions from '@/pages/RolesAndPermissions';
import DevSettings from '@/pages/DevSettings';
import Developer from '@/pages/Developer';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import PlayerRegistrations from '@/pages/PlayerRegistrations';
import TeamGroups from '@/pages/TeamGroups';
import PlayerHistory from '@/pages/PlayerHistory';
import PlayerConsents from '@/pages/PlayerConsents';
import Medical from '@/pages/Medical';
import UserManagementOverview from '@/pages/UserManagementOverview';
import ReportBug from '@/pages/ReportBug';
import Users from '@/pages/Users';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Caricamento...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show restriction page for pending users on all routes except profile
  if (user.role === 'pending' && !window.location.pathname.includes('/profile')) {
    const PendingUserRestriction = React.lazy(() => import('@/components/auth/PendingUserRestriction').then(m => ({ default: m.PendingUserRestriction })));
    return <PendingUserRestriction />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Index />} />
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="teams" element={<Teams />} />
        <Route path="user-management" element={<UserManagementOverview />} />
        <Route path="users" element={<Users />} />
        <Route path="report-bug" element={<ReportBug />} />
        <Route path="team-members" element={<TeamMembers />} />
        <Route path="player-registrations" element={<PlayerRegistrations />} />
        <Route path="team-groups" element={<TeamGroups />} />
        <Route path="player-history" element={<PlayerHistory />} />
        <Route path="player-consents" element={<PlayerConsents />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="documents" element={<Documents />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="training" element={<TrainingPlanner />} />
        <Route path="videos" element={<VideoSessions />} />
        <Route path="company" element={<CompanyInfo />} />
        <Route path="medical" element={<Medical />} />
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="roles-and-permissions" element={<RolesAndPermissions />} />
        <Route path="dev-settings" element={<DevSettings />} />
        <Route path="developer" element={<Developer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
