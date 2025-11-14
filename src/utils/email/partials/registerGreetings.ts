import { resolve } from 'node:path';
import type { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import type { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import type { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export function registerGreetings(
  { name, subject }: IInfoMailDTO['templateData'],
  styles: IInfoMailStyleDTO,
): IParseMailTemplateDTO['partials'][number] {
  const greetings = resolve(
    __dirname,
    '..',
    '..',
    '..',
    'views',
    'greetings.hbs',
  );

  return {
    name: 'greetings',
    file: greetings,
    variables: {
      name,
      subject,
      styles,
    },
  };
}
