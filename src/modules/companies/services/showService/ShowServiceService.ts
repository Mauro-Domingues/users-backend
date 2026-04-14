import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Service } from '@modules/companies/entities/Service';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/services')
@injectable()
export class ShowServiceService {
  public constructor(
    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,
  ) {}

  @Get('{id}')
  @Tags('Service')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<Service>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const service = await this.servicesRepository.findBy(
        {
          where: { id },
          select: {
            id: true,
            name: true,
            description: true,
            companyId: true,
            durationInMinutes: true,
            price: true,
            status: true,
          },
        },
        trx,
      );

      if (!service) {
        throw new AppError(
          'NOT_FOUND',
          `Service not found with id: "${id}"`,
          404,
        );
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Service found successfully',
        data: instanceToInstance(service),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
