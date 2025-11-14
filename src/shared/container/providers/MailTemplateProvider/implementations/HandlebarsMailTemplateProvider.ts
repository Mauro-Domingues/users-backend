import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';
import type { IMailTemplateFragmentDTO } from '../dtos/IMailTemplateFragmentDTO';
import type { IParseMailTemplateDTO } from '../dtos/IParseMailTemplateDTO';
import type { IMailTemplateProvider } from '../models/IMailTemplateProvider';

export class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  private parseTemplate({ file, variables }: IMailTemplateFragmentDTO): string {
    const templateFileContent = readFileSync(file, {
      encoding: 'utf-8',
    });

    const template = Handlebars.compile(templateFileContent);

    return template(variables);
  }

  private registerPartial(partials: IParseMailTemplateDTO['partials']): void {
    partials.forEach(partial => {
      const parsedPartialTemplate = this.parseTemplate(partial);

      Handlebars.registerPartial(partial.name, parsedPartialTemplate);
    });
  }

  public compile({ file, variables, partials }: IParseMailTemplateDTO): string {
    this.registerPartial(partials);

    return this.parseTemplate({ file, variables });
  }
}
