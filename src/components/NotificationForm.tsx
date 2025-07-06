
import React from 'react';
import { SecureNotificationForm } from '@/components/SecureNotificationForm';

interface NotificationFormProps {
  feature: string;
  onSuccess: () => void;
}

// Legacy wrapper - redirect to secure implementation
export function NotificationForm({ feature, onSuccess }: NotificationFormProps) {
  return <SecureNotificationForm feature={feature} onSuccess={onSuccess} />;
}
