import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/appointments')
@injectable()
export class ShowAppointmentService {
  public constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,
  ) {}

  @Get('{id}')
  @Tags('Appointment')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<Appointment>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const appointment = await this.appointmentsRepository.findBy(
        {
          where: { id },
          relations: {
            service: true,
            company: true,
            employee: { profile: true },
            client: { profile: true },
          },
          select: {
            id: true,
            service: { id: true, name: true },
            company: {
              id: true,
              tradeName: true,
              address: {
                id: true,
                city: true,
                complement: true,
                district: true,
                lat: true,
                lon: true,
                number: true,
                uf: true,
                street: true,
                zipcode: true,
              },
            },
            employee: { id: true, profile: { fullName: true } },
            client: { id: true, profile: { fullName: true } },
            datetime: true,
            durationInMinutes: true,
          },
        },
        trx,
      );

      if (!appointment) {
        throw new AppError(
          'NOT_FOUND',
          `Appointment not found with id: "${id}"`,
          404,
        );
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Appointment found successfully',
        data: instanceToInstance(appointment),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
