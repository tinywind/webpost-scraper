import Datastore from 'nedb';

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
    return new Promise((resolve, reject) => {
      this.database
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
    });
  }

  async find(key: KEY): Promise<ENTITY> {
    return new Promise((resolve, reject) => {
      this.database.findOne({ _id: key }, (err, doc) => {
        if (err) reject(err);
        else resolve(doc);
      });
    });
  }

  async insert(entity: ENTITY | Array<ENTITY>): Promise<(ENTITY & { _id: KEY })[]> {
    const entities = (Array.isArray(entity) ? entity : [entity]).map(e => ({ ...e, _id: e[this.keyColumnName] as KEY }));
    return new Promise((resolve, reject) => {
      this.database.insert(entities, (err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  }

  async update(key: KEY, entity: ENTITY): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database.update({ _id: key }, entity, {}, (err, numReplaced) => {
        if (err) reject(err);
        else resolve(numReplaced);
      });
    });
  }

  async delete(key: KEY): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database.remove({ _id: key }, {}, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  }

  async clear(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.database.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  }
}

export default BaseService;
