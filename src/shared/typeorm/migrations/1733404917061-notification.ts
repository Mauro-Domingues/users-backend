import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';
import { NotificationAction } from '@modules/system/enums/NotificationAction';
import { NotificationType } from '@modules/system/enums/NotificationType';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class Notification1733404917061
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          ...this.baseColumns,
          {
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'requester_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'reference_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'read',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(NotificationType),
            isNullable: false,
          },
          {
            name: 'action',
            type: 'enum',
            enum: Object.values(NotificationAction),
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_notifications_user',
      }),
    );

    await queryRunner.createForeignKey(
      'notifications',
      new TableForeignKey({
        columnNames: ['requester_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'SET NULL',
        name: 'FK_notifications_requester',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('notifications', 'FK_notifications_user');
    await queryRunner.dropForeignKey(
      'notifications',
      'FK_notifications_requester',
    );
    await queryRunner.dropTable('notifications', true);
  }
}
