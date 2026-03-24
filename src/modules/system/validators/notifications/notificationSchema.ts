import { Notification } from '@modules/system/entities/Notification';
import { NotificationAction } from '@modules/system/enums/NotificationAction';
import { NotificationType } from '@modules/system/enums/NotificationType';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const notificationSchema = baseSchema(Notification, (ctx, { id }) => ({
  action: ctx.string().valid(...Object.values(NotificationAction)),
  type: ctx.string().valid(...Object.values(NotificationType)),
  content: ctx.string().max(600),
  read: ctx.boolean(),
  reference: id,
  requesterId: id,
  title: ctx.string().max(255),
  userId: id,
}));
