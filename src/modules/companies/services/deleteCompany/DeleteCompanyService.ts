import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/companies')
@injectable()
export class DeleteCompanyService {
  public constructor(
    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Company')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const company = await this.companiesRepository.exists(
        { where: { id } },
        trx,
      );

      if (!company) {
        throw new AppError(
          'NOT_FOUND',
          `Company not found with id: "${id}"`,
          404,
        );
      }

      await this.companiesRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:companies`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted company',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
