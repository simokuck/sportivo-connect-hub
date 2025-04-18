
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotifications } from "@/context/NotificationContext";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  toastMessage?: string;
  toastDescription?: string;
  notifyGroup?: {
    groupId?: string;
    groupName?: string;
    recipients?: string[];
  };
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Conferma",
  cancelText = "Annulla",
  toastMessage,
  toastDescription,
  notifyGroup,
}: ConfirmationModalProps) {
  const { showNotification, showGroupNotification } = useNotifications();

  const handleConfirm = () => {
    onConfirm();
    
    if (toastMessage) {
      if (notifyGroup && (notifyGroup.groupName || notifyGroup.recipients)) {
        // Use group notification if a group is specified
        showGroupNotification("success", toastMessage, {
          description: toastDescription,
          groupName: notifyGroup.groupName,
          recipients: notifyGroup.recipients,
          eventId: notifyGroup.groupId,
        });
      } else {
        // Regular notification for the current user
        showNotification("success", toastMessage, {
          description: toastDescription,
        });
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
