import { DataSource, QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';

export async function seedFolder(
  connection: DataSource,
  trx: QueryRunner,
): Promise<void> {
  await connection
    .query(
      'INSERT INTO folders (id, name, slug) VALUES (?, ?, ?);',
      [uuid(), 'Hidden', 'hidden'],
      trx,
    )
    .then(() => console.log('Folders seeded'));
}
