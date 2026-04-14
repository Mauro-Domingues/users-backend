import type { QueryRunner } from 'typeorm';
import type { Appointment } from '@modules/companies/entities/Appointment';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IAppointmentsRepository extends IBaseRepository<Appointment> {
  checkAvailability(
    baseData: {
      durationInMinutes: number;
      employeeId: string;
      companyId: string;
      datetime: Date;
    },
    trx?: QueryRunner,
  ): Promise<boolean>;
}
