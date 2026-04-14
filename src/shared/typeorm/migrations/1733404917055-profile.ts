import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Profile1733404917055
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
        columns: [
          ...this.baseColumns,
          {
            name: 'avatar_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },
          {
            name: 'birthdate',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['avatar_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'files',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_profiles_avatar',
      }),
    );

    await queryRunner.createIndex(
      'profiles',
      new TableIndex({
        name: 'INDEX_profiles_avatar_id',
        columnNames: ['avatar_id'],
      }),
    );

    await queryRunner.createIndex(
      'profiles',
      new TableIndex({
        name: 'UNIQUE_profiles_avatar_id',
        columnNames: ['avatar_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('profiles', 'FK_profiles_avatar');
    await queryRunner.dropIndex('users', 'INDEX_users_avatar_id');
    await queryRunner.dropIndex('users', 'UNIQUE_users_avatar_id');
    await queryRunner.dropTable('profiles', true);
  }
}
