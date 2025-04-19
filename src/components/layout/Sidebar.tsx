
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
  Wrench,
  UserRound,
  Package,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

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
  const { primaryColor } = useTheme();

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
      icon: Video, 
      label: 'Sessioni Video', 
      href: '/video-sessions', 
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
      icon: FileText, 
      label: 'Anagrafica Società', 
      href: '/company-info', 
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

  // Filtra gli elementi in base al ruolo e all'ordine salvato
  const getFilteredAndOrderedNavItems = () => {
    const savedOrderString = localStorage.getItem('sidebarNavOrder');
    
    if (savedOrderString) {
      try {
        const savedOrder = JSON.parse(savedOrderString);
        const itemsCopy = [...navItems];
        
        // Ordina gli elementi in base all'ordine salvato
        itemsCopy.sort((a, b) => {
          // Trova gli ID in base al label che è univoco
          const idA = savedOrder.indexOf(a.label.toLowerCase().replace(/\s+/g, '-'));
          const idB = savedOrder.indexOf(b.label.toLowerCase().replace(/\s+/g, '-'));
          
          if (idA === -1) return 1;
          if (idB === -1) return -1;
          
          return idA - idB;
        });
        
        // Filtra per ruolo dopo l'ordinamento
        return itemsCopy.filter(item => item.roles.includes(user.role));
      } catch (e) {
        console.error("Errore nel parsing dell'ordine salvato:", e);
        return navItems.filter(item => item.roles.includes(user.role));
      }
    }
    
    return navItems.filter(item => item.roles.includes(user.role));
  };

  const filteredNavItems = getFilteredAndOrderedNavItems();

  // Applica il colore principale alla sidebar
  const sidebarStyle = {
    backgroundColor: primaryColor || '#1976d2', // Usa il colore primario o un blu di default
  };

  return (
    <aside 
      style={sidebarStyle}
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-40 w-64 text-white transform transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/20">
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
                    "flex items-center p-3 text-white hover:bg-white/10 rounded-lg transition-colors",
                    isActive && "bg-white/20"
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

      <div className="p-4 border-t border-white/20">
        <div className="text-sm opacity-70">
          <p>Versione 1.0.0</p>
          <p>© 2025 Sportivo Connect</p>
        </div>
      </div>
    </aside>
  );
};
