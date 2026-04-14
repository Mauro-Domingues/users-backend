import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Query, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IListDTO } from '@dtos/IListDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/appointments')
@injectable()
export class ListAppointmentService {
  public constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Appointment')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: Partial<Appointment>,
  ): Promise<IListDTO<Appointment>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:appointments:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Appointment>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.appointmentsRepository.findAll(
          {
            where: filters,
            page,
            limit,
            relations: {
              service: true,
              company: true,
              employee: { profile: true },
              client: { profile: true },
            },
            select: {
              id: true,
              service: { name: true },
              company: { tradeName: true },
              employee: { id: true, profile: { fullName: true } },
              client: { id: true, profile: { fullName: true } },
              datetime: true,
              durationInMinutes: true,
            },
            order: { datetime: 'DESC' },
          },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed appointments',
        pagination: {
          total: cache.total,
          page,
          perPage: limit,
          lastPage: Math.ceil(cache.total / limit),
        },
        data: cache.data,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
