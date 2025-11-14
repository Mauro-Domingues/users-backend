import type { QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Folder } from '@modules/system/entities/Folder';

export async function seedFolder(trx: QueryRunner): Promise<void> {
  return trx.manager
    .createQueryBuilder()
    .insert()
    .into(Folder)
    .values({
      id: uuid(),
      name: 'Hidden',
      slug: 'hidden',
    })
    .execute()
    .then(() => console.log('Folders seeded'));
}
