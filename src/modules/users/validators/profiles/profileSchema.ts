import { fileSchema } from '@modules/system/validators/files/fileSchema';
import { Profile } from '@modules/users/entities/Profile';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const profileSchema = baseSchema(Profile, (ctx, { id }) => {
  const fileValidationSchema = fileSchema(ctx);

  return {
    fullName: ctx.string().max(255),
    birthday: ctx.date().iso(),
    avatar: fileValidationSchema,
    avatarId: id,
    phone: ctx.string().pattern(/^\d+$/).max(11),
    cpf: ctx.string().pattern(/^\d+$/).max(11),
  };
});
