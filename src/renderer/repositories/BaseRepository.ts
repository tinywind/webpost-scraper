import Dexie, { Table } from 'dexie';
import { DATABASE_NAME, SCHEMA_VERSION } from '@renderer/repositories/database';

export type TABLE_DEFINITION = {
  name: string;
  columns: {
    [key: string]: {
      primaryKey?: boolean;
      dataType: 'string' | 'boolean' | 'object' | 'number' | 'date';
      notNull?: boolean;
    };
  };
};

abstract class BaseService<PRIMARY_TYPE = any, ENTITY = any> extends Dexie {
  private readonly primaryColumn;
  entities!: Table<ENTITY, PRIMARY_TYPE>;

  protected constructor(
    private readonly tableName: string,
    tableDefinition: TABLE_DEFINITION,
  ) {
    super(DATABASE_NAME);
    this.tableName = tableName;
    this.version(SCHEMA_VERSION).stores({
      [tableName]: Object.keys(tableDefinition).join(','),
    });

    this.primaryColumn = (() => {
      const columnNames = Object.keys(tableDefinition);
      return columnNames.find(columnName => (tableDefinition as any)[columnName].primaryKey);
    })();

    this.entities = this.table(tableName);
  }

  async findAll() {
    return this.entities.toArray();
  }

  async find(key: PRIMARY_TYPE) {
    return this.entities.filter(entity => (entity as any)[this.primaryColumn] === key).first();
  }

  async insert(entity: ENTITY | Array<ENTITY>) {
    if (Array.isArray(entity)) {
      return this.entities.bulkAdd(
        entity,
        (entity as any[]).map(e => (e as any)[this.primaryColumn]),
      );
    } else {
      return this.entities.add(entity, (entity as any)[this.primaryColumn]);
    }
  }

  async update(id: PRIMARY_TYPE, entity: ENTITY) {
    return this.entities.update(id, entity as any);
  }

  async remove(id: PRIMARY_TYPE) {
    return this.entities.delete(id);
  }

  async reset() {
    return this.entities.clear();
  }
}

export default BaseService;
