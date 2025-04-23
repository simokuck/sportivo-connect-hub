
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Menu, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, logout, setRole } = useAuth();
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, string> = {
    player: 'Giocatore',
    coach: 'Allenatore',
    admin: 'Amministratore',
    medical: 'Staff Medico',
    developer: 'Sviluppatore',
    pending: 'In Attesa di Approvazione'
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Aggiungiamo una protezione per assicurarci che user non sia null
  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-sportivo-blue dark:text-white">Sportivo Connect Hub</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Demo Role Switcher - remove in production */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {roleLabels[user.role] || 'Utente'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Cambia Ruolo (Demo)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRole('player')}>Giocatore</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole('coach')}>Allenatore</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole('admin')}>Amministratore</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole('medical')}>Staff Medico</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole('developer')}>Sviluppatore</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" className="text-gray-500 dark:text-gray-300 dark:border-gray-600">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Il mio account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profilo</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Impostazioni</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
