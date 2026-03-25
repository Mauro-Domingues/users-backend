import { inject, injectable } from 'tsyringe';
import type { IDeleteCodeDTO } from '@modules/users/dtos/IDeleteCodeDTO';
import type { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { Connection } from '@shared/typeorm';

@injectable()
export class DeleteCode {
  constructor(
    @inject('PasswordResetsRepository')
    private readonly passwordResetsRepository: IPasswordResetsRepository,

    @inject('MailProvider')
    private readonly mailProvider: IMailProvider,
  ) {}

  public static get key(): Capitalize<string> {
    return 'DeleteCode';
  }

  public async handle({
    data: { client, id },
  }: {
    data: IDeleteCodeDTO;
  }): Promise<void> {
    const dbConnection = new Connection(client);
    await dbConnection.connect();
    const { mysql } = dbConnection;

    const trx = mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      console.log(this.mailProvider);
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
