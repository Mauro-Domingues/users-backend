import { resolve } from 'node:path';
import type { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import type { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import type { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export function registerHeader(
  { message }: IInfoMailDTO['templateData'],
  styles: IInfoMailStyleDTO,
): IParseMailTemplateDTO['partials'][number] {
  const header = resolve(__dirname, '..', '..', '..', 'views', 'header.hbs');

  return {
    name: 'header',
    file: header,
    variables: {
      message,
      placeholder: `https://placehold.co/96x96/ffffff/${styles.font.primaryColor.replace(
        /^#/,
        '',
      )}.webp?text=logo\\nda\\nempresa`,
      styles,
    },
  };
}
