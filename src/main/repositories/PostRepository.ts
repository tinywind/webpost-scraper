import { Post } from '@src/types';
import BaseService from './BaseRepository';

export type Type = Omit<Post, 'site'> & { site: string };

class PostRepository extends BaseService<string, Type> {
  constructor() {
    super('post', 'url');
  }

  override async insert(entity: Type | Type[]): Promise<Array<Type & { _id: string }>> {
    return new Promise((resolve, reject) => {
      const entities = (Array.isArray(entity) ? entity : [entity]).map(e => ({ ...e, _id: e.url }));
      this.database.find({ url: { $in: entities.map(e => e.url) } }).exec((err, docs) => {
        if (err) return reject(err);

        const existingUrls = docs.map(doc => doc.url);
        const inserting = entities.filter(e => !existingUrls.includes(e.url));
        if (inserting.length === 0) return resolve([]);

        this.database.insert(inserting, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    });
  }

  async read(url: string | string[]) {
    return new Promise((resolve, reject) => {
      const condition = (Array.isArray(url) ? url : [url]).map(u => ({ _id: u }));
      this.database.update({ $or: condition }, { $set: { read: true } }, { multi: true }, (err, numReplaced) => {
        if (err) reject(err);
        else resolve(numReplaced);
      });
    });
  }

  async mark(url: string) {
    return new Promise((resolve, reject) => {
      this.database.update({ _id: url }, { $set: { marked: true } }, { multi: true }, (err, numReplaced) => {
        if (err) reject(err);
        else resolve(numReplaced);
      });
    });
  }

  async unmark(url: string) {
    return new Promise((resolve, reject) => {
      this.database.update({ _id: url }, { $set: { marked: false } }, { multi: true }, (err, numReplaced) => {
        if (err) reject(err);
        else resolve(numReplaced);
      });
    });
  }

  removeOld(milliseconds: number) {
    return new Promise((resolve, reject) => {
      const condition = Date.now() - milliseconds;
      this.database.remove({ createdAt: { $lt: condition } }, { multi: true }, (err, numRemoved) => {
        if (err) reject(err);
        else resolve(numRemoved);
      });
    });
  }
}

const postRepository = new PostRepository();
export default postRepository;
