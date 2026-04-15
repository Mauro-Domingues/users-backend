import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class CompanyEmployee1776211351311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies_employees',
        columns: [
          {
            name: 'company_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'employee_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'companies_employees',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_companies_employees_company',
      }),
    );

    await queryRunner.createForeignKey(
      'companies_employees',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_companies_employees_employee',
      }),
    );

    await queryRunner.createIndex(
      'companies_employees',
      new TableIndex({
        name: 'INDEX_companies_employees_company_id',
        columnNames: ['company_id'],
      }),
    );

    await queryRunner.createIndex(
      'companies_employees',
      new TableIndex({
        name: 'INDEX_companies_employees_employee_id',
        columnNames: ['employee_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'companies_employees',
      'FK_companies_employees_company',
    );
    await queryRunner.dropForeignKey(
      'companies_employees',
      'FK_companies_employees_employee',
    );
    await queryRunner.dropIndex(
      'companies_employees',
      'INDEX_companies_employees_company_id',
    );
    await queryRunner.dropIndex(
      'companies_employees',
      'INDEX_companies_employees_employee_id',
    );
    await queryRunner.dropTable('companies_employees', true);
  }
}
