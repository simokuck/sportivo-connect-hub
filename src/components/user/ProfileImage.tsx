
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const ProfileImage = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(
    localStorage.getItem('userAvatar') || user?.avatar || null
  );

  React.useEffect(() => {
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem('userAvatar');
      setAvatarUrl(newAvatar || user?.avatar || null);
    };

    window.addEventListener('avatarUpdate', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdate', handleAvatarUpdate);
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
