import { Notification } from '@modules/system/entities/Notification';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class NotificationsRepository
  extends BaseRepository<Notification>
  implements INotificationsRepository
{
  public constructor() {
    super(Notification);
  }

  // non-generic methods here
}
