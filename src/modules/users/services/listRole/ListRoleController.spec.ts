import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';

let connection: IConnection;

describe('ListRoleController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    return connection.mysql.query(
      'INSERT INTO roles (id, name, description) VALUES (?, ?, ?);',
      [uuid(), 'role', 'This is a role'],
    );
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to list all roles', async (): Promise<void> => {
    const response = await request(app.server).get('/roles');

    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty('id');
  });
});
