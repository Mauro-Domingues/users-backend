import { container } from 'tsyringe';
import { mailConfig } from '@config/mail';
import { SESProvider } from './implementations/SESProvider';
import { SMTPProvider } from './implementations/SMTPProvider';
import type { IMailProvider } from './models/IMailProvider';

const providers: Record<typeof mailConfig.driver, () => IMailProvider> = {
  smtp: () => container.resolve(SMTPProvider),
  ses: () => container.resolve(SESProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver](),
);
