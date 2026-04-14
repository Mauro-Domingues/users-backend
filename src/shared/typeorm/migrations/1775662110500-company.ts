import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';
import { CompanyStatus } from '@modules/companies/enums/CompanyStatus';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Company1775662110500
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          ...this.baseColumns,
          {
            name: 'banner_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'address_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'corporate_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'trade_name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'schedule',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(CompanyStatus),
            isNullable: false,
            default: `'${CompanyStatus.INACTIVE}'`,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'companies',
      new TableForeignKey({
        columnNames: ['banner_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_companies_banner',
      }),
    );

    await queryRunner.createForeignKey(
      'companies',
      new TableForeignKey({
        columnNames: ['address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_companies_address',
      }),
    );

    await queryRunner.createIndex(
      'companies',
      new TableIndex({
        name: 'INDEX_companies_address_id',
        columnNames: ['address_id'],
      }),
    );

    await queryRunner.createIndex(
      'companies',
      new TableIndex({
        name: 'INDEX_companies_banner_id',
        columnNames: ['banner_id'],
      }),
    );

    await queryRunner.createIndex(
      'companies',
      new TableIndex({
        name: 'UNIQUE_companies_address_id',
        columnNames: ['address_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'companies',
      new TableIndex({
        name: 'UNIQUE_companies_banner_id',
        columnNames: ['banner_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('companies', 'FK_companies_banner');
    await queryRunner.dropForeignKey('companies', 'FK_companies_address');
    await queryRunner.dropIndex('companies', 'INDEX_companies_address_id');
    await queryRunner.dropIndex('companies', 'INDEX_companies_banner_id');
    await queryRunner.dropIndex('companies', 'UNIQUE_companies_address_id');
    await queryRunner.dropIndex('companies', 'UNIQUE_companies_banner_id');
    await queryRunner.dropTable('companies', true);
  }
}
