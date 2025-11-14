import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey, TableIndex } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Token1733404917057
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          ...this.baseColumns,
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'tokens',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_tokens_user',
      }),
    );

    await queryRunner.createIndex(
      'tokens',
      new TableIndex({
        name: 'UNIQUE_tokens_user_id',
        columnNames: ['user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tokens', 'FK_tokens_user');
    await queryRunner.dropIndex('tokens', 'UNIQUE_tokens_user_id');
    await queryRunner.dropTable('tokens', true);
  }
}
