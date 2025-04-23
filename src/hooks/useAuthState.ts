
import { useState, useCallback } from 'react';
import { User } from '@/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUser = useCallback((newUser: User | null) => {
    console.log('Updating user state:', newUser);
    setUser(newUser);
  }, []);

  return {
    user,
    setUser: updateUser,
    loading,
    setLoading
  };
}
