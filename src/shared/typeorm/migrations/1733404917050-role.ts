import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table } from 'typeorm';
import { RoleType } from '@modules/users/enums/RoleType';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Role1733404917050
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
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
            name: 'type',
            type: 'enum',
            enum: Object.values(RoleType),
            isNullable: false,
            default: `'${RoleType.CUSTOM}'`,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles', true);
  }
}
