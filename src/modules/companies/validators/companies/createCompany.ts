import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { companySchema } from './companySchema';

export const createCompany = baseValidator(ctx => {
  const companyValidationSchema = companySchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: companyValidationSchema.keys({
      tradeName: companyValidationSchema.extract('tradeName').required(),
      cnpj: companyValidationSchema.extract('cnpj').required(),
      corporateName: companyValidationSchema
        .extract('corporateName')
        .required(),
    }),
  };
});
