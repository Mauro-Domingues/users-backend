import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { companySchema } from './companySchema';

export const listCompany = baseValidator(ctx => {
  const companyValidationSchema = companySchema(ctx);

  return {
    params: ctx.object({}),
    query: companyValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
