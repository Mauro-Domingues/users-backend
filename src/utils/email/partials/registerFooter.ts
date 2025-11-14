import { resolve } from 'node:path';
import type { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import type { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import type { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export function registerFooter(
  {
    anchorText,
    anchorUrl,
    buttonText,
    buttonUrl,
  }: IInfoMailDTO['templateData'],
  styles: IInfoMailStyleDTO,
): IParseMailTemplateDTO['partials'][number] {
  const footer = resolve(__dirname, '..', '..', '..', 'views', 'footer.hbs');

  return {
    name: 'footer',
    file: footer,
    variables: {
      buttonText,
      buttonUrl,
      anchorText: anchorText?.toUpperCase(),
      anchorUrl: anchorUrl?.toLowerCase(),
      styles,
    },
  };
}
