import { Appointment } from '@modules/companies/entities/Appointment';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeAppointmentsRepository
  extends FakeBaseRepository<Appointment>
  implements IAppointmentsRepository
{
  public constructor() {
    super(Appointment);
  }

  public async checkAvailability({
    companyId,
    datetime,
    durationInMinutes,
    employeeId,
  }: Parameters<
    IAppointmentsRepository['checkAvailability']
  >[0]): Promise<boolean> {
    const endDateTime = new Date(
      new Date(datetime).getTime() + durationInMinutes * 60000,
    );

    return this.fakeRepository.some(
      entity =>
        entity.companyId === companyId &&
        entity.employeeId === employeeId &&
        new Date(entity.datetime) >= new Date(datetime) &&
        new Date(entity.datetime) <= endDateTime &&
        !entity.deletedAt,
    );
  }
}
