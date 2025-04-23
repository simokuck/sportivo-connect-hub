
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Index />} />
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="teams" element={<Teams />} />
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
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="roles" element={<RolesAndPermissions />} />
        <Route path="dev-settings" element={<DevSettings />} />
        <Route path="developer" element={<Developer />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
