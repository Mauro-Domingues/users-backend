import { container } from 'tsyringe';
import { mailTemplateConfig } from '@config/mailTemplate';
import { HandlebarsProvider } from './implementations/HandlebarsProvider';
import type { IMailTemplateProvider } from './models/IMailTemplateProvider';

const providers: Record<
  typeof mailTemplateConfig.driver,
  () => IMailTemplateProvider
> = {
  handlebars: () => container.resolve(HandlebarsProvider),
};

container.registerInstance<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers[mailTemplateConfig.driver](),
);
