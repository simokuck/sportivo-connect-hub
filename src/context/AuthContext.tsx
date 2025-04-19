import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '@/types';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    firstName: 'Marco',
    lastName: 'Rossi',
    email: 'marco@example.com',
    role: 'player',
    avatar: '/assets/avatars/player1.jpg',
    birthDate: '1995-06-15',
    address: 'Via Roma 123',
    city: 'Milano',
    biometricEnabled: true
  },
  {
    id: '2',
    name: 'Paolo Bianchi',
    firstName: 'Paolo',
    lastName: 'Bianchi',
    email: 'paolo@example.com',
    role: 'coach',
    avatar: '/assets/avatars/coach1.jpg',
    birthDate: '1980-03-22',
    address: 'Via Napoli 45',
    city: 'Roma',
    biometricEnabled: false
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    firstName: 'Giuseppe',
    lastName: 'Verdi',
    email: 'giuseppe@example.com',
    role: 'admin',
    avatar: '/assets/avatars/admin1.jpg',
    birthDate: '1988-11-10',
    address: 'Via Milano 78',
    city: 'Torino',
    biometricEnabled: false
  },
  {
    id: '4',
    name: 'Dott. Anna Ferrari',
    firstName: 'Anna',
    lastName: 'Ferrari',
    email: 'anna@example.com',
    role: 'medical',
    avatar: '/assets/avatars/doctor1.jpg',
    birthDate: '1975-09-05',
    address: 'Via Torino 32',
    city: 'Firenze',
    biometricEnabled: true
  },
  {
    id: '5',
    name: 'Mario Neri',
    firstName: 'Mario',
    lastName: 'Neri',
    email: 'mario@example.com',
    role: 'developer',
    avatar: '/assets/avatars/developer1.jpg',
    birthDate: '1990-02-18',
    address: 'Via Venezia 56',
    city: 'Bologna',
    biometricEnabled: true
  }
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void; // For demo purposes
  updateUserProfile: (data: Partial<User>) => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  toggleBiometric: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (mock implementation)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // Simple mock password check
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // For demo purposes - to easily switch between roles
  const setRole = (role: UserRole) => {
    const demoUser = mockUsers.find(u => u.role === role);
    if (demoUser) {
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  };

  // Update user profile
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in mock data (in a real app, this would be an API call)
      const index = mockUsers.findIndex(u => u.id === user.id);
      if (index !== -1) {
        mockUsers[index] = updatedUser;
      }
    }
  };

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would verify the current password and update it
      if (currentPassword !== 'password') {
        throw new Error('Password attuale non corretta');
      }
      
      // Password updated successfully (in a real app, this would update in the backend)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Toggle biometric authentication
  const toggleBiometric = (enabled: boolean) => {
    if (user) {
      const updatedUser = { ...user, biometricEnabled: enabled };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      setRole, 
      updateUserProfile, 
      updatePassword, 
      toggleBiometric 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
