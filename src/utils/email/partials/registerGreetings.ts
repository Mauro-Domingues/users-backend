import { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import { resolve } from 'node:path';

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
