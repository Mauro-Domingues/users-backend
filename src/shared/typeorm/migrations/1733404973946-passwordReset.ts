import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class PasswordReset1733404973946
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_resets',
        columns: [
          ...this.baseColumns,
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'recovery_code',
            type: 'int',
            width: 6,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'password_resets',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_password_resets_user',
      }),
    );

    await queryRunner.createIndex(
      'password_resets',
      new TableIndex({
        name: 'UNIQUE_password_resets_user_id_recovery_code',
        columnNames: ['user_id', 'recovery_code'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'password_resets',
      'UNIQUE_password_resets_user_id_recovery_code',
    );
    await queryRunner.dropForeignKey(
      'password_resets',
      'FK_password_resets_user',
    );
    await queryRunner.dropTable('password_resets', true);
  }
}
