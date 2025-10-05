import { appConfig } from '@config/app';
import { IDeleteCodeDTO } from '@modules/users/dtos/IDeleteCodeDTO';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { PasswordResetsRepository } from '@modules/users/repositories/PasswordResetsRepository';
import { FakePasswordResetsRepository } from '@modules/users/repositories/fakes/FakePasswordResetsRepository';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const repositories: {
  passwordResets: Record<
    typeof appConfig.config.apiMode,
    () => IPasswordResetsRepository
  >;
} = {
  passwordResets: {
    test: () => new FakePasswordResetsRepository(),
    development: () => new PasswordResetsRepository(),
    production: () => new PasswordResetsRepository(),
  },
};

export class DeleteCode {
  private readonly passwordResetsRepository: IPasswordResetsRepository;

  constructor() {
    this.passwordResetsRepository =
      repositories.passwordResets[appConfig.config.apiMode]();
  }

  public static get key(): Capitalize<string> {
    return 'DeleteCode';
  }

  public async handle({
    data: { client, id },
  }: {
    data: IDeleteCodeDTO;
  }): Promise<void> {
    const mysql = MysqlDataSource(client);

    if (!mysql.isInitialized) {
      await mysql.initialize();
    }

    const trx = mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      await this.passwordResetsRepository.delete({ id }, trx);
      if (trx.isTransactionActive) await trx.commitTransaction();
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
