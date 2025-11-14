import type { MigrationInterface, QueryRunner } from 'typeorm';
import { Table, TableForeignKey } from 'typeorm';
import { BaseMigration } from '@shared/container/modules/migrations/BaseMigration';

export class File1733404917053
  extends BaseMigration
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'files',
        columns: [
          ...this.baseColumns,
          {
            name: 'folder_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'file',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'files',
      new TableForeignKey({
        columnNames: ['folder_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'folders',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_files_folder',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('files', 'FK_files_folder');
    await queryRunner.dropTable('files', true);
  }
}
