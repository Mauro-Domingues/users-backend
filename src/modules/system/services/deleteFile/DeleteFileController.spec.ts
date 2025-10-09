import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { File } from '@modules/systems/entities/File';

const id = uuid();
let connection: IConnection;

describe('DeleteFileController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(File)
      .values({
        id,
        name: 'file',
        description: 'This is a file',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to delete a file', async (): Promise<void> => {
    const response = await request(app.server).delete(`/files/${id}`);

    expect(response.status).toBe(200);
  });
});
