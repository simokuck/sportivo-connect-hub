
import { useNotifications } from '@/context/NotificationContext';
import { Event } from '@/types';

export const useEventNotifications = () => {
  const { showNotification, showGroupNotification } = useNotifications();

  const notifyEventCreated = (event: Event) => {
    // Notifica per il creatore dell'evento
    showNotification(
      "success",
      "Evento creato",
      {
        description: `L'evento "${event.title}" è stato creato con successo`,
        duration: 5000,
      }
    );

    // Notifica per tutti i destinatari
    if (event.recipients && event.recipients.length > 0) {
      showGroupNotification(
        "info",
        "Nuovo evento aggiunto al tuo calendario",
        {
          description: `È stato aggiunto l'evento "${event.title}" al tuo calendario`,
          recipients: event.recipients, // Access the recipients directly as they are already strings
          eventId: event.id,
          priority: "normal",
        }
      );
    }
  };

  const notifyEventUpdated = (event: Event) => {
    // Notifica per il creatore dell'evento
    showNotification(
      "success",
      "Evento aggiornato",
      {
        description: `L'evento "${event.title}" è stato aggiornato con successo`,
        duration: 5000,
      }
    );

    // Notifica per tutti i destinatari
    if (event.recipients && event.recipients.length > 0) {
      showGroupNotification(
        "info",
        "Evento aggiornato nel tuo calendario",
        {
          description: `L'evento "${event.title}" è stato aggiornato`,
          recipients: event.recipients, // Access the recipients directly as they are already strings
          eventId: event.id,
          priority: "normal",
        }
      );
    }
  };

  const notifyEventDeleted = (event: Event) => {
    // Notifica per il creatore dell'evento
    showNotification(
      "info",
      "Evento eliminato",
      {
        description: `L'evento "${event.title}" è stato eliminato`,
        duration: 5000,
      }
    );

    // Notifica per tutti i destinatari
    if (event.recipients && event.recipients.length > 0) {
      showGroupNotification(
        "info",
        "Evento rimosso dal tuo calendario",
        {
          description: `L'evento "${event.title}" è stato rimosso dal tuo calendario`,
          recipients: event.recipients, // Access the recipients directly as they are already strings
          eventId: event.id,
          priority: "normal",
        }
      );
    }
  };

  return {
    notifyEventCreated,
    notifyEventUpdated,
    notifyEventDeleted,
  };
};
