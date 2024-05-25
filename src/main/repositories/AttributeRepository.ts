import BaseService from './BaseRepository';

class _AttributeRepository extends BaseService<string, { key: string; value: any }> {
  constructor() {
    super('attribute', 'key');
  }
}

class AttributeRepository {
  private attributeRepository = new _AttributeRepository();

  async get(): Promise<{ pollingInterval: number; retention: number }> {
    const list = await this.attributeRepository.findAll();
    return {
      pollingInterval: list.find(a => a.key === 'pollingInterval')?.value || 5,
      retention: list.find(a => a.key === 'retention')?.value || 3,
    };
  }

  async save(pollingInterval: number, retention: number) {
    await this.attributeRepository.clear();
    return await this.attributeRepository.insert([
      { key: 'pollingInterval', value: pollingInterval },
      { key: 'retention', value: retention },
    ]);
  }

  async setPollingInterval(pollingInterval: number) {
    return await this.attributeRepository.update('pollingInterval', { key: 'pollingInterval', value: pollingInterval });
  }

  async setRetention(retention: number) {
    return await this.attributeRepository.update('retention', { key: 'retention', value: retention });
  }
}

const attributeRepository = new AttributeRepository();
export default attributeRepository;
