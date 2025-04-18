import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  FileText, 
  Home, 
  Users, 
  Activity,
  X,
  CalendarDays,
  Settings,
  Wrench,
  UserRound,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      href: '/', 
      roles: ['player', 'coach', 'admin', 'medical'] 
    },
    { 
      icon: BarChart3, 
      label: 'Statistiche', 
      href: '/statistics', 
      roles: ['player', 'coach'] 
    },
    { 
      icon: Calendar, 
      label: 'Calendario', 
      href: '/calendar', 
      roles: ['player', 'coach', 'admin', 'medical'] 
    },
    { 
      icon: ClipboardList, 
      label: 'Esercitazioni', 
      href: '/exercises', 
      roles: ['coach'] 
    },
    { 
      icon: CalendarDays, 
      label: 'Pianifica Allenamenti', 
      href: '/training-planner', 
      roles: ['coach'] 
    },
    { 
      icon: Users, 
      label: 'Squadre', 
      href: '/teams', 
      roles: ['coach', 'admin'] 
    },
    { 
      icon: UserRound, 
      label: 'Membri', 
      href: '/team-members', 
      roles: ['coach', 'admin'] 
    },
    { 
      icon: FileText, 
      label: 'Documenti', 
      href: '/documents', 
      roles: ['admin', 'medical', 'player', 'coach'] 
    },
    { 
      icon: Activity, 
      label: 'Area Medica', 
      href: '/medical', 
      roles: ['medical'] 
    },
    { 
      icon: Wrench, 
      label: 'Impostazioni Dev', 
      href: '/dev-settings', 
      roles: ['admin'] 
    },
    { 
      icon: Package, 
      label: 'Magazzino', 
      href: '/warehouse', 
      roles: ['admin'] 
    },
  ];

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <aside 
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 w-64 bg-sportivo-blue text-white transform transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <h2 className="text-xl font-bold">Sportivo</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center p-3 text-white hover:bg-blue-700 rounded-lg transition-colors",
                    isActive && "bg-blue-700"
                  )}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-blue-700">
        <div className="text-sm opacity-70">
          <p>Versione 1.0.0</p>
          <p>© 2025 Sportivo Connect</p>
        </div>
      </div>
    </aside>
  );
};
