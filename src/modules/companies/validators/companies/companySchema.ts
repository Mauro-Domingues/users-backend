import type { IScheduleDTO } from '@modules/companies/dtos/IScheduleDTO';
import { Company } from '@modules/companies/entities/Company';
import { CompanyStatus } from '@modules/companies/enums/CompanyStatus';
import { fileSchema } from '@modules/system/validators/files/fileSchema';
import { addressSchema } from '@modules/users/validators/addresses/addressSchema';
import { userSchema } from '@modules/users/validators/users/userSchema';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { appointmentSchema } from '../appointments/appointmentSchema';
import { serviceSchema } from '../services/serviceSchema';

export const companySchema = baseSchema(Company, (ctx, { id }) => {
  const addressValidationSchema = addressSchema(ctx);
  const fileValidationSchema = fileSchema(ctx);
  const userValidationSchema = userSchema(ctx);
  const serviceValidationSchema = serviceSchema(ctx);
  const appointmentValidationSchema = appointmentSchema(ctx);

  const localeTimeString = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  const dayOfWeekSchema = ctx.string().valid('0', '1', '2', '3', '4', '5', '6');

  const timeScheduleSchema = ctx.object<
    NonNullable<IScheduleDTO[keyof IScheduleDTO]>['workHours']
  >({
    start: ctx.string().pattern(localeTimeString).required(),
    end: ctx.string().pattern(localeTimeString).required(),
  });

  const dayScheduleSchema = ctx.object<IScheduleDTO[keyof IScheduleDTO]>({
    workHours: timeScheduleSchema.required(),
    breaks: ctx.array().items(timeScheduleSchema).required(),
  });

  return {
    corporateName: ctx.string().max(255),
    tradeName: ctx.string().max(255),
    bannerId: id,
    address: addressValidationSchema,
    addressId: id,
    banner: fileValidationSchema,
    cnpj: ctx.string().pattern(/^\d+$/).max(14),
    tolerance: ctx.string().pattern(/^(\d+)(d|h|min|s|ms)$/),
    state: ctx.string().valid('open', 'closed'),
    status: ctx.string().valid(...Object.values(CompanyStatus)),
    services: ctx.array().items(serviceValidationSchema),
    appointments: ctx.array().items(appointmentValidationSchema),
    schedule: ctx
      .object()
      .pattern(
        dayOfWeekSchema,
        ctx.alternatives().try(ctx.valid(null), dayScheduleSchema),
      ),
    employees: ctx.array().items(userValidationSchema),
    weeklySchedule: ctx
      .object()
      .pattern(
        dayOfWeekSchema,
        ctx
          .alternatives()
          .try(ctx.valid(null), ctx.array().items(timeScheduleSchema)),
      ),
  };
});
