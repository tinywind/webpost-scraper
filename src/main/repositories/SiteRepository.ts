import { Site } from '@src/types';
import BaseService from './BaseRepository';

class SiteRepository extends BaseService<string, Site> {
  constructor() {
    super('site', 'id');
  }
}

const siteRepository = new SiteRepository();
export default siteRepository;
