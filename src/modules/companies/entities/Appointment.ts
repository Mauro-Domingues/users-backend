import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entities/User';
import { Base } from '@shared/container/modules/entities/Base';
import { Company } from './Company';
import { Service } from './Service';

@Entity('appointments')
export class Appointment extends Base {
  @Column({ name: 'service_id', type: 'uuid', nullable: true })
  declare public serviceId: string;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  declare public companyId: string;

  @Column({ name: 'employee_id', type: 'uuid', nullable: true })
  declare public employeeId: string;

  @Column({ name: 'client_id', type: 'uuid', nullable: true })
  declare public clientId: string;

  @Column({ name: 'datetime', type: 'datetime', nullable: true })
  declare public datetime: Date;

  @Column({ name: 'duration_in_minutes', type: 'int', nullable: false })
  declare public durationInMinutes: number;

  @ManyToOne(() => Company, company => company.appointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'FK_appointments_company',
    referencedColumnName: 'id',
  })
  declare public company: Company;

  @ManyToOne(() => Service, service => service, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'service_id',
    foreignKeyConstraintName: 'FK_appointments_service',
    referencedColumnName: 'id',
  })
  declare public service: Service;

  @ManyToOne(() => User, employee => employee.employeeAppointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'employee_id',
    foreignKeyConstraintName: 'FK_appointments_employee',
    referencedColumnName: 'id',
  })
  declare public employee: User;

  @ManyToOne(() => User, client => client.clientAppointments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    foreignKeyConstraintName: 'FK_appointments_client',
    referencedColumnName: 'id',
  })
  declare public client: User;
}
