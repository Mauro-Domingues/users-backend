import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';

const id = uuid();
let connection: IConnection;

describe('ShowRoleController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    return connection.mysql.query(
      'INSERT INTO roles (id, name, description) VALUES (?, ?, ?);',
      [id, 'role', 'This is a role'],
    );
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
