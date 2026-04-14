import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@modules/users/entities/User';
import { Company } from './Company';

@Entity('companies_employees')
export class CompanyEmployee {
  @Index('INDEX_companies_employees_company_id', ['companyId'])
  @PrimaryColumn({
    name: 'company_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public companyId: string;

  @Index('INDEX_companies_employees_employee_id', ['employeeId'])
  @PrimaryColumn({
    name: 'employee_id',
    type: 'uuid',
    length: 36,
    nullable: false,
  })
  declare public employeeId: string;

  @ManyToOne(() => Company, company => company, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'company_id',
    foreignKeyConstraintName: 'FK_company_employees_company',
    referencedColumnName: 'id',
  })
  declare public company: Company;

  @ManyToOne(() => User, employee => employee, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'employee_id',
    foreignKeyConstraintName: 'FK_company_employees_employee',
    referencedColumnName: 'id',
  })
  declare public employee: User;
}
