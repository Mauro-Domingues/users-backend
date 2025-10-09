import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';

let connection: IConnection;

describe('CreateUserController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to create a new user', async (): Promise<void> => {
    const response = await request(app.server).post('/users').send({
      name: 'user',
      description: 'This is a user',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
