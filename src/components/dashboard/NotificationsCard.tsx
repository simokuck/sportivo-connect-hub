
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Notification } from '@/types';

interface NotificationsCardProps {
  notifications: Notification[];
}

export const NotificationsCard = ({ notifications }: NotificationsCardProps) => {
  return (
    <Card className="hover-card-highlight">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Bell className="h-5 w-5 mr-2 text-sportivo-blue" />
          Notifiche
        </CardTitle>
        <CardDescription>Ultime comunicazioni</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
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
  );
};
