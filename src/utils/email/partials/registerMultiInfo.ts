import { resolve } from 'node:path';
import type { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import type { IParseMailTemplateDTO } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export function registerMultiInfo({
  info,
}: IInfoMailDTO['templateData']): IParseMailTemplateDTO['partials'][number] {
  const multiInfo = resolve(
    __dirname,
    '..',
    '..',
    '..',
    'views',
    'multi-info.hbs',
  );

  return {
    name: 'multiInfo',
    file: multiInfo,
    variables: {
      info,
    },
  };
}
