
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { mockPlayers, mockEvents, mockNotifications } from '@/data/mockData';

import { StatsCard } from '@/components/dashboard/StatsCard';
import { TeamCard } from '@/components/dashboard/TeamCard';
import { DocumentsCard } from '@/components/dashboard/DocumentsCard';
import { NonCompliantCard } from '@/components/dashboard/NonCompliantCard';
import { EventsCard } from '@/components/dashboard/EventsCard';
import { NotificationsCard } from '@/components/dashboard/NotificationsCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Get next events (for all roles)
  const nextEvents = mockEvents
    .filter(event => new Date(event.start) > new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 3);

  // Get latest notifications for the user's role
  const userNotifications = mockNotifications
    .filter(notification => 
      notification.forRoles?.includes(user.role) || 
      notification.forUsers?.includes(user.id)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get player stats for player role or the first player for coach/admin/medical
  const playerStats = user.role === 'player' 
    ? mockPlayers.find(player => player.id === user.id)?.stats 
    : mockPlayers[0].stats;

  // Add non-compliant members check for admin
  const nonCompliantMembers = mockPlayers.filter(player => 
    !player.isCompliant
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-gray-500">Benvenuto, {user.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Player & Coach: Statistics */}
        {(user.role === 'player' || user.role === 'coach') && (
          <StatsCard
            title="Statistiche"
            description={user.role === 'player' ? 'Le tue statistiche stagionali' : 'Statistiche giocatori'}
            icon={<BarChart3 className="h-5 w-5 mr-2 text-sportivo-blue" />}
            stats={[
              { label: 'Partite', value: playerStats?.games || 0 },
              { label: 'Minuti', value: playerStats?.minutesPlayed || 0 },
              { label: 'Gol', value: playerStats?.goals || 0 },
              { label: 'Assist', value: playerStats?.assists || 0 }
            ]}
            onClick={() => navigate('/statistics')}
          />
        )}

        {/* Coach & Admin: Teams */}
        {(user.role === 'coach' || user.role === 'admin') && (
          <TeamCard onClick={() => navigate('/teams')} />
        )}

        {/* Admin & Medical: Documents */}
        {(user.role === 'admin' || user.role === 'medical') && (
          <DocumentsCard onClick={() => navigate('/documents')} role={user.role} />
        )}

        {/* Admin: Non-compliant Members Overview */}
        {user.role === 'admin' && nonCompliantMembers.length > 0 && (
          <NonCompliantCard 
            members={nonCompliantMembers}
            onClick={() => navigate('/team-members')}
          />
        )}

        {/* All roles: Calendar Events */}
        <EventsCard 
          events={nextEvents}
          onClick={() => navigate('/calendar')}
        />

        {/* All roles: Notifications */}
        <NotificationsCard notifications={userNotifications} />
      </div>
    </div>
  );
};

export default Dashboard;
