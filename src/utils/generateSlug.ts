import type { QueryRunner } from 'typeorm';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';
import { AppError } from '@shared/errors/AppError';
import { slugify } from './slugify';

/**
 * @param { IEntityRepository } IEntityRepository new GenerateSlug(this.somethingRepository) inside the constructor of your class
 */
export class GenerateSlug<
  IEntityRepository extends IBaseRepository<{ slug: string }>,
> {
  private readonly regex: RegExp;

  private index: number;

  public constructor(private readonly repository: IEntityRepository) {
    this.regex = /-idx-(\d+)$/;
    this.index = 0;
  }

  /**
   * @param {string} name Send the name / title of the entity
   * @return {string} slug
   */
  public async execute(name: string, trx: QueryRunner): Promise<string> {
    if (!name)
      throw new AppError(
        'CAN_NOT_SLUGIFY',
        'Can not slugify an undefined word',
      );

    const slug = slugify(name) as string;

    const dataBankItems = await this.repository.findLike(
      {
        where: {
          slug: `${slug}%`,
        },
        order: { slug: 'DESC' },
        select: { slug: true },
      },
      trx,
    );

    if (!dataBankItems.some(item => item.slug === slug)) {
      return slug;
    }

    if (dataBankItems.length) {
      this.index = dataBankItems.reduce((max, dataBankItem) => {
        const match = this.regex.exec(dataBankItem?.slug);
        const index = Number(match?.[1]);

        if (!Number.isNaN(index) && index > max) {
          return index;
        }
        return max;
      }, this.index);
    }

    return `${slug}-idx-${this.index + 1}`;
  }
}
