import { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';
import { resolve } from 'node:path';

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
