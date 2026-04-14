import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import type { IIntervalDTO } from '@dtos/IIntervalDTO';
import { File } from '@modules/system/entities/File';
import { Address } from '@modules/users/entities/Address';
import { User } from '@modules/users/entities/User';
import { Base } from '@shared/container/modules/entities/Base';
import { buildTargetDate } from '@utils/companies/buildTargetDate';
import { calculateRequiredMinutes } from '@utils/companies/calculateRequiredMinutes';
import { computeCurrentState } from '@utils/companies/computeCurrentState';
import { computeEmployeeBlocks } from '@utils/companies/computeEmployeeBlocks';
import { minutesToTime } from '@utils/companies/minutesToTime';
import { unionIntervals } from '@utils/companies/unionIntervals';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import type { IScheduleDTO } from '../dtos/IScheduleDTO';
import type { IWeeklyScheduleDTO } from '../dtos/IWeeklyScheduleDTO';
import { CompanyStatus } from '../enums/CompanyStatus';
import { Appointment } from './Appointment';
import { Service } from './Service';

@Entity('companies')
export class Company extends Base {
  declare public weeklySchedule: IWeeklyScheduleDTO;

  declare public state: 'open' | 'closed';

  @Index('INDEX_companies_banner_id', ['bannerId'])
  @Column({ name: 'banner_id', type: 'uuid', nullable: true })
  declare public bannerId: string;

  @Index('INDEX_companies_address_id', ['addressId'])
  @Column({ name: 'address_id', type: 'uuid', nullable: true })
  declare public addressId: string;

  @Column({ name: 'tolerance', type: 'varchar', nullable: false })
  declare public tolerance: IIntervalDTO;

  @Column({ name: 'corporate_name', type: 'varchar', nullable: false })
  declare public corporateName: string;

  @Column({ name: 'trade_name', type: 'varchar', nullable: false })
  declare public tradeName: string;

  @Column({ name: 'cnpj', type: 'varchar', length: 14, nullable: false })
  declare public cnpj: string;

  @Column({ name: 'schedule', type: 'json', nullable: false })
  declare public schedule: IScheduleDTO;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CompanyStatus,
    nullable: false,
    default: CompanyStatus.INACTIVE,
  })
  declare public status: CompanyStatus;

  @OneToMany(() => Service, service => service.company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public services: Array<Service>;

  @OneToMany(() => Appointment, appointment => appointment.company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare public appointments: Array<Appointment>;

  @OneToOne(() => File, banner => banner, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'banner_id',
    foreignKeyConstraintName: 'FK_companies_banner',
    referencedColumnName: 'id',
  })
  declare public banner: File;

  @OneToOne(() => Address, address => address, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'address_id',
    foreignKeyConstraintName: 'FK_companies_address',
    referencedColumnName: 'id',
  })
  declare public address: Address;

  @ManyToMany(() => User, employee => employee.companies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinTable({
    name: 'companies_employees',
    joinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_companies_employees_company',
    },
    inverseJoinColumn: {
      name: 'employee_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_companies_employees_employee',
    },
  })
  declare public employees: Array<User>;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  protected getWeeklySchedule(
    date?: Date,
    serviceId?: string,
    employeeId: string = '56912d93-2413-4490-b08b-f51963699e71',
  ): IWeeklyScheduleDTO {
    const baseDate = date ? new Date(date) : new Date();

    const toleranceMinutes = convertToMilliseconds(this.tolerance) / 60000;

    const requiredMinutes = calculateRequiredMinutes({
      serviceId,
      toleranceMinutes,
      services: this.services,
    });

    const employees = employeeId
      ? this.employees.filter(e => e.id === employeeId)
      : this.employees;

    this.state = computeCurrentState(baseDate, this.schedule);

    this.weeklySchedule = Array.from({ length: 7 }).reduce<IWeeklyScheduleDTO>(
      (acc, _, i) => {
        const targetDate = buildTargetDate(baseDate, i);
        const dayIdx = targetDate.getDay().toString() as keyof IScheduleDTO;
        const dayConfig = this.schedule?.[dayIdx];

        if (!dayConfig) {
          acc[dayIdx] = null;
          return acc;
        }

        const perEmployeeBlocks = employees.map(employee =>
          computeEmployeeBlocks({
            appointments: this.appointments,
            toleranceMinutes,
            targetDate,
            dayConfig,
            employee,
          }),
        );

        let companySlots = unionIntervals(perEmployeeBlocks.flat());

        if (requiredMinutes > 0) {
          companySlots = companySlots.filter(
            slot => slot.end - slot.start >= requiredMinutes,
          );
        }

        acc[dayIdx] = companySlots.map(slot => ({
          start: minutesToTime(slot.start),
          end: minutesToTime(slot.end),
        }));

        return acc;
      },
      {} as IWeeklyScheduleDTO,
    );

    return this.weeklySchedule;
  }
}
