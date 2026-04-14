import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/services')
@injectable()
export class DeleteServiceService {
  public constructor(
    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Service')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const service = await this.servicesRepository.findBy(
        { where: { id }, select: { companyId: true } },
        trx,
      );

      if (!service) {
        throw new AppError(
          'NOT_FOUND',
          `Service not found with id: "${id}"`,
          404,
        );
      }

      await this.servicesRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:services`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:companies:${service.companyId}`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted service',
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
