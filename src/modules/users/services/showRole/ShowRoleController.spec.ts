import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { Role } from '@modules/users/entities/Role';

const id = uuid();
let connection: IConnection;

describe('ShowRoleController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values({
        id,
        name: 'role',
        description: 'This is a role',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to show a role', async (): Promise<void> => {
    const response = await request(app.server).get(`/roles/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
  });
});
