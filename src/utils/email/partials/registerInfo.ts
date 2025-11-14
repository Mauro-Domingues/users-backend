import { resolve } from 'node:path';
import type { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import type { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export function registerInfo({
  info: infoText,
}: IInfoMailDTO['templateData']): IParseMailTemplateDTO['partials'][number] {
  const info = resolve(__dirname, '..', '..', '..', 'views', 'info.hbs');

  return {
    name: 'info',
    file: info,
    variables: {
      info: infoText,
    },
  };
}
