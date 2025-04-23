import React, { useState, useEffect } from 'react';
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
  Package,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Video,
  Code,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
}

export const CollapsibleSidebar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { primaryColor } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  
  const getInitialNavItems = (): NavItem[] => {
    const savedOrderString = localStorage.getItem('sidebarNavOrder');
    
    const defaultNavItems: NavItem[] = [
      { 
        id: 'dashboard',
        icon: Home, 
        label: 'Dashboard', 
        href: '/dashboard', 
        roles: ['player', 'coach', 'admin', 'medical', 'developer'] 
      },
      { 
        id: 'statistics',
        icon: BarChart3, 
        label: 'Statistiche', 
        href: '/statistics', 
        roles: ['player', 'coach'] 
      },
      { 
        id: 'calendar',
        icon: Calendar, 
        label: 'Calendario', 
        href: '/calendar', 
        roles: ['player', 'coach', 'admin', 'medical', 'developer'] 
      },
      { 
        id: 'training',
        icon: ClipboardList, 
        label: 'Allenamenti', 
        href: '/training', 
        roles: ['coach'] 
      },
      { 
        id: 'videos',
        icon: Video, 
        label: 'Video', 
        href: '/videos', 
        roles: ['coach'] 
      },
      { 
        id: 'teams',
        icon: Users, 
        label: 'Squadre', 
        href: '/teams', 
        roles: ['coach', 'admin'] 
      },
      { 
        id: 'team-members',
        icon: UserRound, 
        label: 'Membri', 
        href: '/team-members', 
        roles: ['coach', 'admin'] 
      },
      { 
        id: 'documents',
        icon: FileText, 
        label: 'Documenti', 
        href: '/documents', 
        roles: ['admin', 'medical', 'player', 'coach', 'developer'] 
      },
      { 
        id: 'medical',
        icon: Activity, 
        label: 'Area Medica', 
        href: '/medical', 
        roles: ['medical'] 
      },
      { 
        id: 'dev-settings',
        icon: Wrench, 
        label: 'Impostazioni Dev', 
        href: '/dev-settings', 
        roles: ['developer'] 
      },
      { 
        id: 'company',
        icon: Building, 
        label: 'Anagrafica Società', 
        href: '/company', 
        roles: ['admin'] 
      },
      { 
        id: 'warehouse',
        icon: Package, 
        label: 'Magazzino', 
        href: '/warehouse', 
        roles: ['admin'] 
      },
      { 
        id: 'developer',
        icon: Code, 
        label: 'Area Developer', 
        href: '/developer', 
        roles: ['developer'] 
      },
    ];
    
    if (savedOrderString) {
      try {
        const savedOrder = JSON.parse(savedOrderString);
        
        const reorderedItems = [...defaultNavItems];
        reorderedItems.sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id);
          const indexB = savedOrder.indexOf(b.id);
          
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          
          return indexA - indexB;
        });
        
        return reorderedItems;
      } catch (e) {
        console.error("Errore nel parsing dell'ordine salvato:", e);
        return defaultNavItems;
      }
    }
    
    return defaultNavItems;
  };
  
  const [navItems, setNavItems] = useState<NavItem[]>(getInitialNavItems());

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);
  
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (user?.role !== 'developer') return;
    
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    if (user?.role !== 'developer') return;
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (user?.role !== 'developer') return;
    e.preventDefault();
    
    if (!draggedItemId || draggedItemId === targetId) return;
    
    const itemsCopy = [...navItems];
    const draggedItemIndex = itemsCopy.findIndex(item => item.id === draggedItemId);
    const targetItemIndex = itemsCopy.findIndex(item => item.id === targetId);
    
    if (draggedItemIndex === -1 || targetItemIndex === -1) return;
    
    const [draggedItem] = itemsCopy.splice(draggedItemIndex, 1);
    itemsCopy.splice(targetItemIndex, 0, draggedItem);
    
    setNavItems(itemsCopy);
    
    const newOrder = itemsCopy.map(item => item.id);
    localStorage.setItem('sidebarNavOrder', JSON.stringify(newOrder));
    
    toast({
      title: "Ordine aggiornato",
      description: "L'ordine delle sezioni è stato aggiornato",
    });
    
    setDraggedItemId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  if (!user) return null;

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role)
  );

  const sidebarStyle = {
    backgroundColor: primaryColor || '#1976d2',
  };

  const canReorderSidebar = user.role === 'developer';

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <button
        className="fixed left-4 top-4 z-30 rounded-md border bg-background p-2 md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
        >
          <path
            d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      <aside 
        style={sidebarStyle}
        className={cn(
          "fixed md:sticky inset-y-0 left-0 z-40 flex h-screen flex-col border-r text-white transition-all duration-300",
          isOpen ? "w-64" : "w-16",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className={cn("text-xl font-bold transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:hidden")}>
            Sportivo
          </h2>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileOpen(false)} 
              className="text-white md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-white hidden md:flex"
            >
              {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.href}
                    draggable={canReorderSidebar}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "relative",
                      draggedItemId === item.id && canReorderSidebar ? "opacity-50" : "opacity-100"
                    )}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center p-3 text-white hover:bg-white/10 rounded-lg transition-colors",
                      isActive && "bg-white/20"
                    )}
                    title={!isOpen ? item.label : undefined}
                  >
                    {canReorderSidebar && isOpen && (
                      <GripVertical className="h-4 w-4 mr-2 cursor-grab opacity-50 hover:opacity-100" />
                    )}
                    <item.icon className={cn("h-5 w-5", isOpen ? "mr-3" : "mx-auto")} />
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={cn("p-4 border-t border-white/20", !isOpen && "hidden md:block")}>
          <div className={cn("text-sm opacity-70", !isOpen && "hidden")}>
            <p>Versione 1.0.0</p>
            <p className={isOpen ? "" : "hidden"}>© 2025 Sportivo Connect</p>
          </div>
        </div>
      </aside>
    </>
  );
};
