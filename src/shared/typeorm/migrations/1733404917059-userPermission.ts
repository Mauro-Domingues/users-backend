import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class UserPermission1733404917059 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_permissions',
        columns: [
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'permission_id',
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
      'users_permissions',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_users_permissions_user',
      }),
    );

    await queryRunner.createForeignKey(
      'users_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_users_permissions_permission',
      }),
    );

    await queryRunner.createIndex(
      'users_permissions',
      new TableIndex({
        name: 'INDEX_users_permissions_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'users_permissions',
      new TableIndex({
        name: 'INDEX_users_permissions_permission_id',
        columnNames: ['permission_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'users_permissions',
      'FK_users_permissions_user',
    );
    await queryRunner.dropForeignKey(
      'users_permissions',
      'FK_users_permissions_permission',
    );
    await queryRunner.dropIndex(
      'users_permissions',
      'INDEX_users_permissions_user_id',
    );
    await queryRunner.dropIndex(
      'users_permissions',
      'INDEX_users_permissions_permission_id',
    );
    await queryRunner.dropTable('users_permissions', true);
  }
}
