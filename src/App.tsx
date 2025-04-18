
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { ThemeProvider } from '@/context/ThemeContext'

import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import Statistics from '@/pages/Statistics'
import Calendar from '@/pages/Calendar'
import Exercises from '@/pages/Exercises'
import TrainingPlanner from '@/pages/TrainingPlanner'
import Teams from '@/pages/Teams'
import TeamMembers from '@/pages/TeamMembers'
import Documents from '@/pages/Documents'
import Warehouse from '@/pages/Warehouse'
import UserProfile from '@/pages/UserProfile'
import NotFound from '@/pages/NotFound'
import DevSettings from '@/pages/DevSettings'
import Index from '@/pages/Index'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="statistics" element={<Statistics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="exercises" element={<Exercises />} />
                <Route path="training-planner" element={<TrainingPlanner />} />
                <Route path="teams" element={<Teams />} />
                <Route path="team-members" element={<TeamMembers />} />
                <Route path="documents" element={<Documents />} />
                <Route path="medical" element={<Index />} />
                <Route path="warehouse" element={<Warehouse />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="dev-settings" element={<DevSettings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
