import type { Appointment } from '@modules/companies/entities/Appointment';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { appointmentSchema } from './appointmentSchema';

export const updateAppointment = baseValidator(ctx => {
  const appointmentValidationSchema = appointmentSchema(ctx);

  return {
    params: ctx.object<Appointment>({
      id: appointmentValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: appointmentValidationSchema,
  };
});
