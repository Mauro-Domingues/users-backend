import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { File } from '@modules/systems/entities/File';

let connection: IConnection;

describe('ListFileController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(File)
      .values({
        id: uuid(),
        name: 'file',
        description: 'This is a file',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to list all files', async (): Promise<void> => {
    const response = await request(app.server).get('/files');

    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty('id');
  });
});
