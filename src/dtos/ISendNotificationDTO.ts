import { Notification } from '@modules/system/entities/Notification';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

export interface ISendNotificationDTO {
  client: string;
  data: {
    userCondition: Parameters<IUsersRepository['findAll']>[0]['where'];
    requesterId?: Notification['requesterId'];
    referenceId?: Notification['referenceId'];
    action: Notification['action'];
    type: Notification['type'];
  };
}
