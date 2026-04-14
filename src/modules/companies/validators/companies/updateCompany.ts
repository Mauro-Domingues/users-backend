import type { Company } from '@modules/companies/entities/Company';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { companySchema } from './companySchema';

export const updateCompany = baseValidator(ctx => {
  const companyValidationSchema = companySchema(ctx);

  return {
    params: ctx.object<Company>({
      id: companyValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: companyValidationSchema,
  };
});
