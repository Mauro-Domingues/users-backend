import { User } from '@modules/users/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';
import { FindOptionsWhere, QueryRunner } from 'typeorm';
import { Profile } from '../entities/Profile';

export class UsersRepository
  extends BaseRepository<User>
  implements IUsersRepository
{
  public constructor() {
    super(User);
  }

  public override async findAll(
    {
      page,
      limit,
      where,
      ...baseData
    }: Parameters<IUsersRepository['findAll']>[0],
    trx: QueryRunner,
  ): Promise<{ list: Array<User>; amount: number }> {
    return trx.manager
      .findAndCount(User, {
        skip: page && limit && (page - 1) * limit,
        take: limit,
        ...baseData,
        where: (() => {
          if (!where) return undefined;

          if (Array.isArray(where)) {
            where.forEach(condition => {
              condition.profile ??= {};
              this.setSearchFilter(
                condition.profile as FindOptionsWhere<Profile>,
                'fullName',
              );
            });
          } else {
            where.profile ??= {};
            this.setSearchFilter(
              where.profile as FindOptionsWhere<Profile>,
              'fullName',
            );
          }

          return where;
        })(),
      })
      .then(([list, amount]) => ({ list, amount }));
  }
}
