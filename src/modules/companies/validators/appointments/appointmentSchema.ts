import { Appointment } from '@modules/companies/entities/Appointment';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const appointmentSchema = baseSchema(Appointment, (ctx, { id }) => ({
  durationInMinutes: ctx.number().integer().positive(),
  datetime: ctx.date().iso(),
  employeeId: id,
  serviceId: id,
  companyId: id,
  clientId: id,
}));
