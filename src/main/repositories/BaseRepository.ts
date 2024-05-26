import Datastore from '@seald-io/nedb';

export const DATABASE_NAME = 'scraper';
export const SCHEMA_VERSION = 1;

abstract class BaseService<KEY, ENTITY = any> {
  protected database: Datastore<ENTITY>;

  protected constructor(
    private readonly tableName: string,
    private readonly keyColumnName: keyof ENTITY,
  ) {
    this.tableName = tableName;
    this.keyColumnName = keyColumnName;
    this.database = new Datastore({ filename: `${DATABASE_NAME}-${SCHEMA_VERSION}__${tableName}.db`, autoload: true });
  }

  async findAll({ limit, skip }: { limit?: number; skip?: number } = {}): Promise<ENTITY[]> {
    return await this.database.findAsync({}).skip(skip).limit(limit).sort({ createdAt: -1 });
  }

  async find(key: KEY): Promise<ENTITY> {
    return await this.database.findOneAsync({ _id: key });
  }

  async insert(entity: ENTITY | Array<ENTITY>): Promise<(ENTITY & { _id: KEY })[]> {
    const entities = (Array.isArray(entity) ? entity : [entity]).map(e => ({ ...e, _id: e[this.keyColumnName] as KEY }));
    return await this.database.insertAsync(entities);
  }

  async update(key: KEY, entity: ENTITY): Promise<number> {
    return (await this.database.updateAsync({ _id: key }, entity, {})).numAffected;
  }

  async delete(key: KEY): Promise<number> {
    return await this.database.removeAsync({ _id: key }, {});
  }

  async clear(): Promise<number> {
    return await this.database.removeAsync({}, { multi: true });
  }
}

export default BaseService;
