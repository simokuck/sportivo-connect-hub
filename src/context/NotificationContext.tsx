
import React, { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { LucideIcon } from "lucide-react";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationOptions {
  description?: string;
  duration?: number;
  icon?: React.ReactNode; // Changed from LucideIcon to ReactNode
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    options?: NotificationOptions
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
