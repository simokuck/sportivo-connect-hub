
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const ProfileImage = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    localStorage.getItem('userAvatar') || user?.avatar || null
  );

  React.useEffect(() => {
    // Funzione per gestire l'aggiornamento dell'avatar
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem('userAvatar');
      setAvatarUrl(newAvatar || user?.avatar || null);
    };

    // Aggiungi event listener per l'evento personalizzato
    window.addEventListener('avatarUpdate', handleAvatarUpdate);
    
    // Aggiungi anche un listener per storage che controlla se l'avatar è cambiato
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userAvatar') {
        setAvatarUrl(event.newValue || user?.avatar || null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('avatarUpdate', handleAvatarUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user?.avatar]);

  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-32 w-32'
  }[size];

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={avatarUrl || undefined} alt={user?.name || 'User'} />
      <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
    </Avatar>
  );
};
