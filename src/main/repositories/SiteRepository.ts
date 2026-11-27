import { Site } from '@src/types';
import BaseService from './BaseRepository';

class SiteRepository extends BaseService<Site> {
  constructor() {
    super('site');
  }
}

const siteRepository = new SiteRepository();
export default siteRepository;
