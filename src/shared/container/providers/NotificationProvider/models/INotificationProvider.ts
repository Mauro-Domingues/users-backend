import type { ISendNotificationDTO } from '../dtos/ISendNotificationDTO';

export interface INotificationProvider {
  sendNotification(data: ISendNotificationDTO): Promise<void>;
}
