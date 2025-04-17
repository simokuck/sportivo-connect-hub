
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    email: 'marco@example.com',
    role: 'player',
    avatar: '/assets/avatars/player1.jpg'
  },
  {
    id: '2',
    name: 'Paolo Bianchi',
    email: 'paolo@example.com',
    role: 'coach',
    avatar: '/assets/avatars/coach1.jpg'
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    email: 'giuseppe@example.com',
    role: 'admin',
    avatar: '/assets/avatars/admin1.jpg'
  },
  {
    id: '4',
    name: 'Dott. Anna Ferrari',
    email: 'anna@example.com',
    role: 'medical',
    avatar: '/assets/avatars/doctor1.jpg'
  }
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setRole: (role: UserRole) => void; // For demo purposes
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

  // Check for stored user on initial load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setRole }}>
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
