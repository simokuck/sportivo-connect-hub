
import React, { createContext, useContext, ReactNode } from "react";
import { toast, ToastT } from "sonner";
import { LucideIcon } from "lucide-react";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationOptions {
  description?: string;
  duration?: number;
  icon?: LucideIcon;
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
  ) => ToastT;
  dismissNotification: (toastId: string | number) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const showNotification = (
    type: NotificationType, 
    message: string, 
    options?: NotificationOptions
  ): ToastT => {
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
        return toast.success(message, toastOptions);
      case "info":
        return toast.info(message, toastOptions);
      case "warning": 
        return toast.warning(message, toastOptions);
      case "error":
        return toast.error(message, toastOptions);
      default:
        return toast(message, toastOptions);
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
