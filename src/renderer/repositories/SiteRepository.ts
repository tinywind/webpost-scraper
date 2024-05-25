import { Site } from '@renderer/types';
import BaseService from './BaseRepository';
import { SITE_DEFINITION, SITE_TABLE } from './scheme';

export default class SiteRepository extends BaseService<string, Site> {
  constructor() {
    super(SITE_TABLE, SITE_DEFINITION);
  }
}
