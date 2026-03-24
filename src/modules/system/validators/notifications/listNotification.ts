import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { notificationSchema } from './notificationSchema';

export const listNotification = baseValidator(ctx => {
  const notificationValidationSchema = notificationSchema(ctx);

  return {
    params: ctx.object({}),
    query: notificationValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
