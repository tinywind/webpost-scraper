import BaseService from './BaseRepository';
import siteRepository from './SiteRepository';
import type { Setting } from '@src/types';

type Attribute =
  | { key: 'settings'; value: Setting }
  | { key: 'theme'; value: Setting['theme'] }
  | { key: 'pollingInterval' | 'retention'; value: number };

class AttributeRepository extends BaseService<Attribute> {
  constructor() {
    super('attribute');
  }

  async get(): Promise<Setting> {
    const attributes = await this.findAll();
    const snapshot = attributes.find(a => a.key === 'settings');
    if (snapshot) return snapshot.value;
    const setting: Setting = { theme: 'system', pollingInterval: 5, retention: 3, sites: await siteRepository.findAll() };
    for (const attribute of attributes) {
      if (attribute.key === 'theme') setting.theme = attribute.value;
      if (attribute.key === 'retention' || attribute.key === 'pollingInterval') setting[attribute.key] = attribute.value;
    }
    return setting;
  }

  async save(value: Setting) {
    await this.database.updateAsync({ _id: 'settings' }, { key: 'settings', value, _id: 'settings' }, { upsert: true });
  }
}

export default new AttributeRepository();
