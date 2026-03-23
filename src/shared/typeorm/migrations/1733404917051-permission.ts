import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';
import { PermissionMethod } from '@modules/users/enums/PermissionMethod';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Permission1733404917051
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissions',
        columns: [
          ...this.baseColumns,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'route',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'method',
            type: 'enum',
            enum: Object.values(PermissionMethod),
            isNullable: false,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('permissions', true);
  }
}
