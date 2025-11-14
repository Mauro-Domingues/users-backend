import { container } from 'tsyringe';
import { mailTemplateConfig } from '@config/mailTemplate';
import { HandlebarsMailTemplateProvider } from './implementations/HandlebarsMailTemplateProvider';
import type { IMailTemplateProvider } from './models/IMailTemplateProvider';

const providers: Record<
  typeof mailTemplateConfig.driver,
  () => IMailTemplateProvider
> = {
  handlebars: () => container.resolve(HandlebarsMailTemplateProvider),
};

container.registerInstance<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers[mailTemplateConfig.driver](),
);
