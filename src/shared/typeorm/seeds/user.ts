import { hash } from 'bcrypt';
import type { QueryRunner } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { hashConfig } from '@config/hash';
import { User } from '@modules/users/entities/User';

export async function seedUser(trx: QueryRunner): Promise<void> {
  const password = await hash('Admin*123@', hashConfig.config.salt);

  return trx.manager
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({
      id: uuid(),
      email: 'manager@admin.com.br',
      password,
    })
    .execute()
    .then(() => console.log('Users seeded'));
}
