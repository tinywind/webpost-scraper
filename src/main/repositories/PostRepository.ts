import { Post } from '@src/types';
import BaseService from './BaseRepository';

export type Type = Omit<Post, 'site'> & { site: string };

class PostRepository extends BaseService<string, Type> {
  constructor() {
    super('post', 'url');
  }

  override async insert(entity: Type | Type[]): Promise<Array<Type & { _id: string }>> {
    const entities = (Array.isArray(entity) ? entity : [entity]).map(e => ({ ...e, _id: e.url }));
    const existingUrls = new Set((await this.database.findAsync({ url: { $in: entities.map(e => e.url) } })).map(doc => doc.url));
    const inserting = entities.filter(e => !existingUrls.has(e.url));
    if (inserting.length === 0) return [];
    return await this.database.insertAsync(inserting);
  }

  async read(url: string | string[]) {
    return (await this.database.updateAsync({ $or: (Array.isArray(url) ? url : [url]).map(u => ({ _id: u })) }, { $set: { read: true } }, { multi: true })).numAffected;
  }

  async delete(url: string | string[]) {
    return await this.database.removeAsync({ $or: (Array.isArray(url) ? url : [url]).map(u => ({ _id: u })) }, { multi: true });
  }

  async mark(url: string) {
    return (await this.database.updateAsync({ _id: url }, { $set: { marked: true } }, { multi: true })).numAffected;
  }

  async unmark(url: string) {
    return (await this.database.updateAsync({ _id: url }, { $set: { marked: false } }, { multi: true })).numAffected;
  }

  async removeOld(milliseconds: number) {
    return await this.database.removeAsync({ createdAt: { $lt: Date.now() - milliseconds } }, { multi: true });
  }
}

const postRepository = new PostRepository();
export default postRepository;
