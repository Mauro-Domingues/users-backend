import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';

let connection: IConnection;

describe('CreateFileController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to create a new file', async (): Promise<void> => {
    const response = await request(app.server).post('/files').send({
      name: 'file',
      description: 'This is a file',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('id');
  });
});
