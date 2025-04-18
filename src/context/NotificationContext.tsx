
import React, { createContext, useContext, ReactNode } from "react";
import { toast, Toast } from "sonner";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationOptions {
  description?: string;
  duration?: number;
  icon?: ReactNode; // Changed from LucideIcon to ReactNode
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface GroupNotificationOptions extends NotificationOptions {
  recipients?: string[]; // User IDs or groups to receive the notification
  groupName?: string; // Name of the group (e.g., "Team A")
  eventId?: string; // ID of the event being notified about
  priority?: "low" | "normal" | "high"; // Priority level of the notification
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ) => void;
  showGroupNotification: (
    type: NotificationType,
    message: string,
    options?: GroupNotificationOptions
  ) => void;
  dismissNotification: (toastId: string | number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const showNotification = (
    type: NotificationType, 
    message: string, 
    options?: NotificationOptions
  ): void => {
    const toastOptions = {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: options?.icon,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
    };

    switch (type) {
      case "success":
        toast.success(message, toastOptions);
        break;
      case "info":
        toast.info(message, toastOptions);
        break;
      case "warning": 
        toast.warning(message, toastOptions);
        break;
      case "error":
        toast.error(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
        break;
    }
  };

  const showGroupNotification = (
    type: NotificationType,
    message: string,
    options?: GroupNotificationOptions
  ): void => {
    // Show a notification to the current user
    showNotification(type, message, options);

    // In a real application, here we would:
    // 1. Make an API call to send push notifications to all members of the group
    // 2. Store the notification in a database
    // 3. Broadcast the notification to all connected clients
    
    const groupInfo = options?.groupName 
      ? `${options.groupName}` 
      : 'tutti i membri del gruppo';
    
    const priority = options?.priority || 'normal';
    const recipients = options?.recipients || [];
    
    console.log(`[Notification] Inviando notifica di gruppo a ${groupInfo}`, {
      type,
      message,
      recipients,
      eventId: options?.eventId,
      priority
    });
    
    // Here you would make the API call to send push notifications
    // For now we're just logging it to the console
  };

  const dismissNotification = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  const clearNotifications = () => {
    toast.dismiss();
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        showGroupNotification,
        dismissNotification, 
        clearNotifications 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
