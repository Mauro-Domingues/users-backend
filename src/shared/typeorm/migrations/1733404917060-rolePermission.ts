import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';

export class RolePermission1733404917060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles_permissions',
        columns: [
          {
            name: 'role_id',
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
      'roles_permissions',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_roles_permissions_role',
      }),
    );

    await queryRunner.createForeignKey(
      'roles_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_roles_permissions_permission',
      }),
    );

    await queryRunner.createIndex(
      'roles_permissions',
      new TableIndex({
        name: 'INDEX_roles_permissions_role_id',
        columnNames: ['role_id'],
      }),
    );

    await queryRunner.createIndex(
      'roles_permissions',
      new TableIndex({
        name: 'INDEX_roles_permissions_permission_id',
        columnNames: ['permission_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'roles_permissions',
      'FK_roles_permissions_role',
    );
    await queryRunner.dropForeignKey(
      'roles_permissions',
      'FK_roles_permissions_permission',
    );
    await queryRunner.dropIndex(
      'roles_permissions',
      'INDEX_roles_permissions_role_id',
    );
    await queryRunner.dropIndex(
      'roles_permissions',
      'INDEX_roles_permissions_permission_id',
    );
    await queryRunner.dropTable('roles_permissions', true);
  }
}
