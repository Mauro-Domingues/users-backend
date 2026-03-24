import type { Notification } from '@modules/system/entities/Notification';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface INotificationsRepository
  extends IBaseRepository<Notification> {
  // non-generic methods here
}
