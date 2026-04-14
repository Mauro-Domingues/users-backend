import type { QueryRunner } from 'typeorm';
import { Between } from 'typeorm';
import { Appointment } from '@modules/companies/entities/Appointment';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class AppointmentsRepository
  extends BaseRepository<Appointment>
  implements IAppointmentsRepository
{
  public constructor() {
    super(Appointment);
  }

  public async checkAvailability(
    {
      durationInMinutes,
      employeeId,
      companyId,
      datetime,
    }: Parameters<IAppointmentsRepository['checkAvailability']>[0],
    trx: QueryRunner,
  ) {
    return trx.manager.exists(Appointment, {
      where: {
        companyId,
        employeeId,
        datetime: Between(
          datetime,
          new Date(new Date(datetime).getTime() + durationInMinutes * 60000),
        ),
      },
    });
  }
}
