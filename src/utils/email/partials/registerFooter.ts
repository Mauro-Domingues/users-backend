import { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import { resolve } from 'node:path';

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
