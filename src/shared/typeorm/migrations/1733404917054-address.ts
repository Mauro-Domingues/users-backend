import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Address1733404917054
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          ...this.baseColumns,
          {
            name: 'street',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'number',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'district',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'uf',
            type: 'varchar',
            length: '2',
            isNullable: true,
          },
          {
            name: 'zipcode',
            type: 'varchar',
            length: '8',
            isNullable: true,
          },
          {
            name: 'lat',
            type: 'decimal',
            precision: 9,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'lon',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('addresses', true);
  }
}
