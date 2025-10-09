import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { Permission } from '@modules/users/entities/Permission';

const id = uuid();
let connection: IConnection;

describe('DeletePermissionController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values({
        id,
        name: 'permission',
        description: 'This is a permission',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to delete a permission', async (): Promise<void> => {
    const response = await request(app.server).delete(`/permissions/${id}`);

    expect(response.status).toBe(200);
  });
});
