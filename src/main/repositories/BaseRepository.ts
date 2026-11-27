import Datastore from '@seald-io/nedb';
import { app } from 'electron';
import path from 'node:path';

abstract class BaseService<ENTITY> {
  private store?: Datastore<ENTITY>;

  protected constructor(private readonly tableName: string) {}

  protected get database() {
    return this.store ??= new Datastore<ENTITY>({
      filename: path.join(app.getPath('userData'), 'scraper-data', `scraper-1__${this.tableName}.db`),
      autoload: true,
    });
  }

  async findAll(): Promise<ENTITY[]> {
    return await this.database.findAsync({}).sort({ createdAt: -1 });
  }
}

export default BaseService;
