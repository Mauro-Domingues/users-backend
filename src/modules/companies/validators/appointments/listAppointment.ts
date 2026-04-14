import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { appointmentSchema } from './appointmentSchema';

export const listAppointment = baseValidator(ctx => {
  const appointmentValidationSchema = appointmentSchema(ctx);

  return {
    params: ctx.object({}),
    query: appointmentValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
