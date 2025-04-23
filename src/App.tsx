
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { WarehouseProvider } from './context/WarehouseContext';
import { PlayerManagementProvider } from './context/PlayerManagementContext';
import AppRoutes from './routes/AppRoutes';

import './App.css';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="sportivo-theme">
        <AuthProvider>
          <NotificationProvider>
            <WarehouseProvider>
              <PlayerManagementProvider>
                <Router>
                  <AppRoutes />
                  <Toaster />
                </Router>
              </PlayerManagementProvider>
            </WarehouseProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
