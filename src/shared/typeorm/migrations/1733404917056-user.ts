import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class User1733404917056
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          ...this.baseColumns,
          {
            name: 'profile_id',
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
            name: 'role_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_users_profile',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['address_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'addresses',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_users_address',
      }),
    );

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        name: 'FK_users_role',
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'UNIQUE_users_profile_id',
        columnNames: ['profile_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'UNIQUE_users_address_id',
        columnNames: ['address_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'UNIQUE_users_role_id',
        columnNames: ['role_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'FK_users_profile');
    await queryRunner.dropForeignKey('users', 'FK_users_address');
    await queryRunner.dropForeignKey('users', 'FK_users_role');
    await queryRunner.dropIndex('users', 'UNIQUE_users_profile_id');
    await queryRunner.dropIndex('users', 'UNIQUE_users_address_id');
    await queryRunner.dropIndex('users', 'UNIQUE_users_role_id');
    await queryRunner.dropTable('users', true);
  }
}
