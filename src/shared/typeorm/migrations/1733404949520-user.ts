import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class User1733404949520
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'FK_users_profile');
    await queryRunner.dropForeignKey('users', 'FK_users_address');
    await queryRunner.dropIndex('users', 'UNIQUE_users_profile_id');
    await queryRunner.dropIndex('users', 'UNIQUE_users_address_id');
    await queryRunner.dropTable('users', true);
  }
}
