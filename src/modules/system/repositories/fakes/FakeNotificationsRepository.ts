import { Notification } from '@modules/system/entities/Notification';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeNotificationsRepository
  extends FakeBaseRepository<Notification>
  implements INotificationsRepository
{
  public constructor() {
    super(Notification);
  }

  // non-generic methods here
}
