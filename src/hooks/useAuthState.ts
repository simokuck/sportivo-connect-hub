
import { useState, useCallback, useRef, useEffect } from 'react';
import { User } from '@/types';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const updateUser = useCallback((newUser: User | null) => {
    if (mounted.current) {
      console.log('Updating user state:', newUser);
      setUser(newUser);
    }
  }, []);

  const updateLoading = useCallback((state: boolean) => {
    if (mounted.current) {
      setLoading(state);
    }
  }, []);

  return {
    user,
    setUser: updateUser,
    loading,
    setLoading: updateLoading
  };
}
