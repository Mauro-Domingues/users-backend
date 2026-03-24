import { container } from 'tsyringe';
import { notificationConfig } from '@config/notification';
import { FirebaseProvider } from './implementations/FirebaseProvider';
import { OneSignalProvider } from './implementations/OneSignalProvider';
import type { INotificationProvider } from './models/INotificationProvider';

const providers: Record<
  typeof notificationConfig.driver,
  () => INotificationProvider
> = {
  onesignal: () => container.resolve(OneSignalProvider),
  firebase: () => container.resolve(FirebaseProvider),
};

container.registerInstance<INotificationProvider>(
  'NotificationProvider',
  providers[notificationConfig.driver](),
);
