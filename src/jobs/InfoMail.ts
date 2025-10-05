import { mailConfig } from '@config/mail';
import { SESMailProvider } from '@shared/container/providers/MailProvider/implementations/SESMailProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getType } from 'mime';
import { registerHeader } from '@utils/email/partials/registerHeader';
import { registerGreetings } from '@utils/email/partials/registerGreetings';
import { registerFooter } from '@utils/email/partials/registerFooter';
import { registerMultiInfo } from '@utils/email/partials/registerMultiInfo';
import { IInfoMailDTO } from '@dtos/IInfoMailDTO';
import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { HandlebarsMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';
import { mailTemplateConfig } from '@config/mailTemplate';
import { IMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import { FakeMailTemplateProvider } from '@shared/container/providers/MailTemplateProvider/fakes/FakeMailTemplateProvider';
import { IInfoMailStyleDTO } from '@dtos/IInfoMailStyleDTO';
import { SMTPMailProvider } from '@shared/container/providers/MailProvider/implementations/SMTPMailProvider';
import { appConfig } from '@config/app';

const providers: {
  mailTemplate: Record<
    typeof mailTemplateConfig.driver | 'test',
    () => IMailTemplateProvider
  >;
  mail: Record<
    typeof mailConfig.driver | 'test',
    (mailTemplateProvider: IMailTemplateProvider) => IMailProvider
  >;
} = {
  mailTemplate: {
    handlebars: () => new HandlebarsMailTemplateProvider(),
    test: () => new FakeMailTemplateProvider(),
  },
  mail: {
    smtp: (mailTemplateProvider: IMailTemplateProvider) =>
      new SMTPMailProvider(mailTemplateProvider),
    ses: (mailTemplateProvider: IMailTemplateProvider) =>
      new SESMailProvider(mailTemplateProvider),
    test: (mailTemplateProvider: IMailTemplateProvider) =>
      new FakeMailProvider(mailTemplateProvider),
  },
};

export class InfoMail {
  private readonly mailTemplateProvider: IMailTemplateProvider;

  private readonly mailProvider: IMailProvider;

  public constructor() {
    this.mailTemplateProvider =
      providers.mailTemplate[
        appConfig.config.apiMode === 'test' ? 'test' : mailTemplateConfig.driver
      ]();
    this.mailProvider = providers.mail[
      appConfig.config.apiMode === 'test' ? 'test' : mailConfig.driver
    ](this.mailTemplateProvider);
  }

  public static get key(): Capitalize<string> {
    return 'InfoMail';
  }

  private get styles(): IInfoMailStyleDTO {
    const logoPath = resolve(__dirname, '..', 'assets', 'logo.svg');
    const logo = readFileSync(logoPath, 'base64');
    const contentType = getType(logoPath);

    return {
      layout: {
        backgroundColor: '#FFFFFF',
        lineColor: '#0B5A7AB3',
      },
      logo: {
        url: `data:${contentType};base64,${logo}`,
        borderColor: '#FFFFFFB3',
      },
      font: {
        primaryColor: '#0F273C',
        secondaryColor: '#4B4F51B3',
        highlightedColor: '#0F273C',
      },
      button: {
        primaryColor: '#0F273C',
        secondaryColor: '#0B5A7A33',
      },
    };
  }

  public async handle({
    data: { templateData, to, from },
  }: {
    data: IInfoMailDTO;
  }): Promise<void> {
    templateData.name = to.name;

    const file = resolve(__dirname, '..', 'views', 'info-mail.hbs');

    await this.mailProvider.sendMail({
      to,
      from,
      subject: templateData.subject,
      templateData: {
        file,
        variables: {
          styles: this.styles,
          subject: templateData.subject,
        },
        partials: [
          registerHeader(templateData, this.styles),
          registerGreetings(templateData, this.styles),
          registerMultiInfo(templateData),
          registerFooter(templateData, this.styles),
        ],
      },
    });
  }
}
