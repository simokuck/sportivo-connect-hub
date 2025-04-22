
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Dumbbell, 
  FileText, 
  BarChart2, 
  Package2, 
  Video, 
  Building, 
  Settings, 
  Code, 
  LogOut,
  User,
  UserRound,
  History,
  ClipboardList,
  FileCheck,
  Users as UsersIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { user, logout, setRole } = useAuth();
  const [playersOpen, setPlayersOpen] = React.useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical', 'developer'],
    },
    {
      name: 'Calendario',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical', 'developer'],
    },
    {
      name: 'Giocatori',
      icon: <UserRound className="w-5 h-5" />,
      roles: ['admin', 'coach', 'medical'],
      submenu: [
        {
          name: 'Registrazioni',
          path: '/player-registrations',
          icon: <User className="w-4 h-4" />,
          roles: ['admin', 'coach'],
        },
        {
          name: 'Gruppi Squadra',
          path: '/team-groups',
          icon: <UsersIcon className="w-4 h-4" />,
          roles: ['admin', 'coach'],
        },
        {
          name: 'Storico',
          path: '/player-history',
          icon: <History className="w-4 h-4" />,
          roles: ['admin', 'coach'],
        },
        {
          name: 'Consensi',
          path: '/player-consents',
          icon: <FileCheck className="w-4 h-4" />,
          roles: ['admin'],
        },
        {
          name: 'Membri Team',
          path: '/team-members',
          icon: <ClipboardList className="w-4 h-4" />,
          roles: ['admin', 'coach', 'medical'],
        },
      ],
    },
    {
      name: 'Teams',
      path: '/teams',
      icon: <Users className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical', 'developer'],
    },
    {
      name: 'Allenamenti',
      path: '/training',
      icon: <Dumbbell className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical'],
    },
    {
      name: 'Documenti',
      path: '/documents',
      icon: <FileText className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical'],
    },
    {
      name: 'Statistiche',
      path: '/statistics',
      icon: <BarChart2 className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player', 'medical'],
    },
    {
      name: 'Magazzino',
      path: '/warehouse',
      icon: <Package2 className="w-5 h-5" />,
      roles: ['admin', 'coach'],
    },
    {
      name: 'Video',
      path: '/videos',
      icon: <Video className="w-5 h-5" />,
      roles: ['admin', 'coach', 'player'],
    },
    {
      name: 'Società',
      path: '/company',
      icon: <Building className="w-5 h-5" />,
      roles: ['admin'],
    },
    {
      name: 'Impostazioni',
      path: '/dev-settings',
      icon: <Settings className="w-5 h-5" />,
      roles: ['admin', 'developer'],
    },
    {
      name: 'Developer',
      path: '/developer',
      icon: <Code className="w-5 h-5" />,
      roles: ['developer'],
    },
  ];

  // Demo role switcher per facilitare i test
  const demoRoles = [
    { id: '1', name: 'Marco Rossi', role: 'player' },
    { id: '2', name: 'Paolo Bianchi', role: 'coach' },
    { id: '3', name: 'Giuseppe Verdi', role: 'admin' },
    { id: '4', name: 'Dott. Anna Ferrari', role: 'medical' },
    { id: '5', name: 'Mario Neri', role: 'developer' },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role || '')
  );

  return (
    <div className={cn(
      "h-screen fixed top-0 left-0 z-40 flex flex-col bg-background border-r",
      collapsed ? "w-16" : "w-64",
      "transition-width duration-300 ease-in-out"
    )}>
      <div className="flex items-center justify-center h-16 border-b">
        {collapsed ? (
          <span className="text-2xl font-bold text-sportivo-blue">S</span>
        ) : (
          <span className="text-2xl font-bold text-sportivo-blue">Sportivo</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {filteredNavItems.map((item, index) => {
            if (item.submenu) {
              return (
                <li key={index}>
                  <Collapsible
                    open={playersOpen}
                    onOpenChange={setPlayersOpen}
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-3 py-2 text-left",
                          collapsed ? "px-2 justify-center" : ""
                        )}
                      >
                        {item.icon}
                        {!collapsed && <span className="ml-3">{item.name}</span>}
                        {!collapsed && (
                          <span className="ml-auto">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`h-4 w-4 transition-transform ${
                                playersOpen ? "rotate-180" : ""
                              }`}
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      {item.submenu.filter(subitem => 
                        subitem.roles.includes(user?.role || '')
                      ).map((subitem, subindex) => (
                        <Link
                          key={subindex}
                          to={subitem.path}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive(subitem.path)
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            collapsed ? "justify-center px-2" : ""
                          )}
                        >
                          {subitem.icon}
                          {!collapsed && <span className="ml-3">{subitem.name}</span>}
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </li>
              );
            }
            
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md",
                    isActive(item.path)
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed ? "justify-center px-2" : ""
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-2 border-t">
        <Link
          to="/profile"
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            isActive('/profile')
              ? "bg-accent text-accent-foreground font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed ? "justify-center px-2" : ""
          )}
        >
          <User className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Profilo</span>}
        </Link>

        <Button
          variant="ghost"
          className={cn(
            "w-full mt-2 justify-start px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            collapsed ? "justify-center px-2" : ""
          )}
          onClick={() => logout()}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>

      {/* Demo role switcher, solo per facilitare lo sviluppo e i test */}
      {process.env.NODE_ENV !== 'production' && !collapsed && (
        <div className="p-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">Demo: Cambia Ruolo</div>
          <div className="space-y-1">
            {demoRoles.map(role => (
              <Button
                key={role.id}
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start text-xs",
                  user?.id === role.id ? "bg-accent" : ""
                )}
                onClick={() => setRole(role.role as any)}
              >
                {role.name} ({role.role})
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
