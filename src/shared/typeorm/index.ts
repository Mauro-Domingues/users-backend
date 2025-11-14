import type { DataSource } from 'typeorm';
import { appConfig } from '@config/app';
import { ormConfig } from '@config/orm';
import { FakeDataSource } from './dataSources/fakes/fakeDataSource';
import { MysqlDataSource } from './dataSources/mysqlDataSource';

export interface IConnection {
  connect(): Promise<void>;
  fakeConnect(): void;
  readonly client: string;
  readonly mysql: DataSource;
}

export class Connection implements IConnection {
  public readonly client: string;

  public readonly mysql: DataSource;

  public constructor(client?: string) {
    if (appConfig.config.apiMode === 'test') {
      this.client = 'database_test';
    } else if (client) {
      this.client = client;
    }
  }

  private setFakeDataSources(): void {
    Object.assign(this, {
      mysql: FakeDataSource(this.client),
    });
  }

  private setDataSources(): void {
    Object.assign(this, {
      mysql: MysqlDataSource(this.client ?? ormConfig.config.mysql.database),
    });
  }

  public fakeConnect(): void {
    this.setFakeDataSources();
  }

  public async connect(): Promise<void> {
    this.setDataSources();

    if (!this.mysql.isInitialized) {
      await this.mysql.initialize();
    }
  }
}
