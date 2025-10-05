import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { DataSource, QueryRunner } from 'typeorm';
import { hashConfig } from '@config/hash';

export async function seedUser(
  connection: DataSource,
  trx: QueryRunner,
): Promise<void> {
  const password = await hash('Admin*123@', hashConfig.config.salt);

  return connection
    .query(
      'INSERT INTO users (id, email, password) VALUES (?, ?, ?);',
      [uuid(), 'manager@admin.com.br', password],
      trx,
    )
    .then(() => console.log('Users seeded'));
}
