import type { ISendNotificationDTO } from '../dtos/ISendNotificationDTO';
import type { INotificationProvider } from '../models/INotificationProvider';

export class FakeNotificationProvider implements INotificationProvider {
  private readonly notification = new Set<ISendNotificationDTO>();

  public async sendNotification(data: ISendNotificationDTO): Promise<void> {
    this.notification.add(data);
  }
}
