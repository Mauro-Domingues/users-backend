import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';
import { ServiceStatus } from '@modules/companies/enums/ServiceStatus';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Service1733404917063
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'services',
        columns: [
          ...this.baseColumns,
          {
            name: 'company_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'duration_in_minutes',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(ServiceStatus),
            isNullable: false,
            default: `'${ServiceStatus.UNAVAILABLE}'`,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'services',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_services_company',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('services', 'FK_services_company');
    await queryRunner.dropTable('services', true);
  }
}
