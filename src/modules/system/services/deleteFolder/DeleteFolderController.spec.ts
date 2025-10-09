import request from 'supertest';
import { Connection, IConnection } from '@shared/typeorm';
import { app } from '@shared/app';
import { v4 as uuid } from 'uuid';
import { Folder } from '@modules/system/entities/Folder';

const id = uuid();
let connection: IConnection;

describe('DeleteFolderController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = new Connection();
    await connection.connect();
    await connection.mysql.runMigrations();

    await connection.mysql
      .createQueryBuilder()
      .insert()
      .into(Folder)
      .values({
        id,
        name: 'folder',
        description: 'This is a folder',
      })
      .execute();
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to delete a folder', async (): Promise<void> => {
    const response = await request(app.server).delete(`/folders/${id}`);

    expect(response.status).toBe(200);
  });
});
