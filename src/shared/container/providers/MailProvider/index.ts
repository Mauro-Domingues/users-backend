import { container } from 'tsyringe';
import { mailConfig } from '@config/mail';
import { SESMailProvider } from './implementations/SESMailProvider';
import { SMTPMailProvider } from './implementations/SMTPMailProvider';
import type { IMailProvider } from './models/IMailProvider';

const providers: Record<typeof mailConfig.driver, () => IMailProvider> = {
  smtp: () => container.resolve(SMTPMailProvider),
  ses: () => container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver](),
);
