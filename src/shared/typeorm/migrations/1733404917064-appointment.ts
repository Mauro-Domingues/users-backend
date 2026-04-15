import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Appointment1733404917065
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          ...this.baseColumns,
          {
            name: 'service_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'company_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'employee_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'client_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'datetime',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'duration_in_minutes',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_appointments_company',
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['service_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'services',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_appointments_service',
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_appointments_employee',
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['client_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_appointments_client',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'FK_appointments_company');
    await queryRunner.dropForeignKey('appointments', 'FK_appointments_service');
    await queryRunner.dropForeignKey(
      'appointments',
      'FK_appointments_employee',
    );
    await queryRunner.dropForeignKey('appointments', 'FK_appointments_client');
    await queryRunner.dropTable('appointments', true);
  }
}
