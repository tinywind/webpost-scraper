import { TABLE_DEFINITION } from '@renderer/repositories/BaseRepository';

export const SITE_TABLE = 'site';
export const POST_TABLE = 'post';

export const SITE_DEFINITION: TABLE_DEFINITION = {
  name: SITE_TABLE,
  columns: {
    id /* uuid */: { primaryKey: true, dataType: 'string', notNull: true },
    name: { dataType: 'string', notNull: true },
    url: { dataType: 'string', notNull: true },
    favicon: { dataType: 'string' },
    articleSelector: { dataType: 'string' },
    titleSelector: { dataType: 'object' },
    urlSelector: { dataType: 'object' },
    createdAtSelector: { dataType: 'object' },
  },
};
export const POST_DEFINITION: TABLE_DEFINITION = {
  name: POST_TABLE,
  columns: {
    url: { primaryKey: true, dataType: 'string', notNull: true },
    site: { dataType: 'string', notNull: true },
    title: { dataType: 'string', notNull: true },
    createdAt: { dataType: 'date', notNull: true },
    read: { dataType: 'boolean', notNull: true },
    marked: { dataType: 'boolean', notNull: true },
  },
};
