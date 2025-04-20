
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, FileText, Bell, BarChart3, AlertTriangle } from 'lucide-react';
import { mockPlayers, mockEvents, mockNotifications } from '@/data/mockData';

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
          <Card className="hover-card-highlight cursor-pointer" onClick={() => navigate('/statistics')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-sportivo-blue" />
                Statistiche
              </CardTitle>
              <CardDescription>
                {user.role === 'player' ? 'Le tue statistiche stagionali' : 'Statistiche giocatori'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Partite</p>
                  <p className="text-xl font-semibold">{playerStats?.games}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Minuti</p>
                  <p className="text-xl font-semibold">{playerStats?.minutesPlayed}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Gol</p>
                  <p className="text-xl font-semibold">{playerStats?.goals}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500">Assist</p>
                  <p className="text-xl font-semibold">{playerStats?.assists}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Coach & Admin: Teams */}
        {(user.role === 'coach' || user.role === 'admin') && (
          <Card className="hover-card-highlight cursor-pointer" onClick={() => navigate('/teams')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-sportivo-blue" />
                Squadre
              </CardTitle>
              <CardDescription>
                Gestione squadre e giocatori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                  <span>Prima Squadra</span>
                  <span className="text-xs bg-sportivo-blue text-white px-2 py-1 rounded">
                    {mockPlayers.length} giocatori
                  </span>
                </li>
                <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                  <span>Under 17</span>
                  <span className="text-xs bg-sportivo-green text-white px-2 py-1 rounded">
                    12 giocatori
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Admin & Medical: Documents */}
        {(user.role === 'admin' || user.role === 'medical') && (
          <Card className="hover-card-highlight cursor-pointer" onClick={() => navigate('/documents')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-5 w-5 mr-2 text-sportivo-blue" />
                Documenti
              </CardTitle>
              <CardDescription>
                {user.role === 'admin' ? 'Gestione documentale' : 'Documenti medici'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                  <span className="text-sm">Certificati medici</span>
                  <span className="text-xs bg-sportivo-green text-white px-2 py-1 rounded">
                    Aggiornati
                  </span>
                </li>
                <li className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                  <span className="text-sm">Contratti</span>
                  <span className="text-xs bg-sportivo-blue text-white px-2 py-1 rounded">
                    3 in scadenza
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Admin: Non-compliant Members Overview */}
        {user.role === 'admin' && nonCompliantMembers.length > 0 && (
          <Card className="hover-card-highlight cursor-pointer" onClick={() => navigate('/team-members')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Membri Non in Regola
              </CardTitle>
              <CardDescription>
                Richiede attenzione immediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {nonCompliantMembers.map((member) => (
                  <li key={member.id} className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
                    <p className="font-medium dark:text-white">{member.name}</p>
                    <p className="text-xs text-red-600 dark:text-red-300">Documenti mancanti o scaduti</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* All roles: Calendar Events */}
        <Card className="hover-card-highlight cursor-pointer" onClick={() => navigate('/calendar')}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="h-5 w-5 mr-2 text-sportivo-blue" />
              Prossimi Eventi
            </CardTitle>
            <CardDescription>
              I tuoi prossimi impegni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {nextEvents.map((event) => (
                <li key={event.id} className="p-2 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                    <div className="flex items-center text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(event.start).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* All roles: Notifications */}
        <Card className="hover-card-highlight">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-sportivo-blue" />
              Notifiche
            </CardTitle>
            <CardDescription>
              Ultime comunicazioni
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userNotifications.length > 0 ? (
                userNotifications.map((notification) => (
                  <li 
                    key={notification.id} 
                    className={`p-2 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'} rounded-md`}
                  >
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.date).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-500">Nessuna notifica</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
