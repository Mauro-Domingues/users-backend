import type { Appointment } from '../entities/Appointment';

export interface IAppointmentDTO extends Partial<Appointment> {
  companyId: string;
  employeeId: string;
  datetime: Date;
}
