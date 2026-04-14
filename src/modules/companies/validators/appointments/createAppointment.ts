import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { appointmentSchema } from './appointmentSchema';

export const createAppointment = baseValidator(ctx => {
  const appointmentValidationSchema = appointmentSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: appointmentValidationSchema.keys({
      companyId: appointmentValidationSchema.extract('companyId').required(),
      serviceId: appointmentValidationSchema.extract('serviceId').required(),
      datetime: appointmentValidationSchema.extract('datetime').required(),
    }),
  };
});
