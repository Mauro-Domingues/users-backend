import type { Notification } from '@modules/system/entities/Notification';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { notificationSchema } from './notificationSchema';

export const viewNotification = baseValidator(ctx => {
  const notificationValidationSchema = notificationSchema(ctx);

  return {
    params: ctx.object<Notification>({
      id: notificationValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
