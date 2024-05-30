import BaseService from './BaseRepository';
import { ThemeType } from '@src/types';

class _AttributeRepository extends BaseService<string, { key: string; value: any }> {
  constructor() {
    super('attribute', 'key');
  }
}

class AttributeRepository {
  private attributeRepository = new _AttributeRepository();

  async get(): Promise<{ theme: ThemeType; pollingInterval: number; retention: number }> {
    const list = await this.attributeRepository.findAll();
    return {
      theme: list.find(a => a.key === 'theme')?.value || 'system',
      pollingInterval: list.find(a => a.key === 'pollingInterval')?.value || 5,
      retention: list.find(a => a.key === 'retention')?.value || 3,
    };
  }

  async save(theme: ThemeType, pollingInterval: number, retention: number) {
    await this.setTheme(theme);
    await this.setPollingInterval(pollingInterval);
    await this.setRetention(retention);
  }

  async setTheme(theme: ThemeType) {
    const e = { key: 'theme', value: theme };
    if (await this.attributeRepository.find('theme')) {
      return await this.attributeRepository.update(e.key, e);
    } else {
      return await this.attributeRepository.insert(e);
    }
  }

  async setPollingInterval(pollingInterval: number) {
    const e = { key: 'pollingInterval', value: pollingInterval };
    if (pollingInterval < 1) throw new Error('Polling interval must be greater than 0');
    if (await this.attributeRepository.find('pollingInterval')) {
      return await this.attributeRepository.update(e.key, e);
    } else {
      return await this.attributeRepository.insert(e);
    }
  }

  async setRetention(retention: number) {
    const e = { key: 'retention', value: retention };
    if (await this.attributeRepository.find('retention')) {
      return await this.attributeRepository.update(e.key, e);
    } else {
      return await this.attributeRepository.insert(e);
    }
  }
}

const attributeRepository = new AttributeRepository();
export default attributeRepository;
