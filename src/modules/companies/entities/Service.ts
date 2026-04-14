import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Base } from '@shared/container/modules/entities/Base';
import { ServiceStatus } from '../enums/ServiceStatus';
import { Company } from './Company';

@Entity('services')
export class Service extends Base {
  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  declare public companyId: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  declare public name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  declare public description: string;

  @Column({ name: 'duration_in_minutes', type: 'int', nullable: false })
  declare public durationInMinutes: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ServiceStatus,
    nullable: false,
    default: ServiceStatus.UNAVAILABLE,
  })
  declare public status: ServiceStatus;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  declare public price: number;

  @ManyToOne(() => Company, company => company.services, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'FK_services_company',
    referencedColumnName: 'id',
  })
  declare public company: Company;

  @AfterLoad()
  @AfterUpdate()
  @AfterInsert()
  protected normalizeValues(): void {
    if (this.price) this.price = Number(this.price);
  }
}
