import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { User } from '@modules/users/entities/User';

const id = uuid();
let connection: IConnection;

describe('DeleteUserController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        id,
        name: 'user',
        description: 'This is a user',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to delete a user', async (): Promise<void> => {
    const response = await request(app.server).delete(`/users/${id}`);

    expect(response.status).toBe(200);
  });
});
