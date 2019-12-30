import {NPC, NPCUtil} from '../utils/npc.util';
import {languages} from '../static-data/language.data';
const PromiseThrottle: any = require('promise-throttle');

export class NpcHandler {
  static getByIds(ids: number[]): Promise<NPC[]> {
    return new Promise<NPC[]>((resolve, reject) => {
      const promiseThrottle = new PromiseThrottle({
        requestsPerSecond: 25,
        promiseImplementation: Promise
      });
      const promises = [];
      ids.forEach(id => promises.push(
        promiseThrottle.add(() => NPCUtil.getById(id))));
      Promise.all(promises)
        .then((res: NPC[]) => resolve(res))
        .catch(reject);
    });
  }
}
