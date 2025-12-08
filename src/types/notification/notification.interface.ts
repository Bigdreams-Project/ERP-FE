export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
  channels?: Array<{
    channel: string;
    status: string;
  }>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  inApp: boolean;
}

export interface INotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}







