import {environment} from '../../../client/src/environments/environment';
import {ItemHandler} from './item.handler';
import {Item} from '../../../client/src/client/models/item/item';
import {DatabaseUtil} from '../utils/database.util';

const PromiseThrottle: any = require('promise-throttle');

describe('ItemHandler', () => {
  let originalEnvironment;
  beforeAll(() => {
    originalEnvironment = environment.test;
    environment.test = true;
  });
  afterAll(() => {
    environment.test = originalEnvironment;
  });

  it('Can get complete item', async () => {
    jest.setTimeout(10000);
    const item: Item = await new ItemHandler().getFreshItem(109118, 'en_GB');
    console.log('Item data', item);
    expect(item.itemSource.droppedBy.length).toBe(8);
    expect(item.expansionId).toBe(5);
    expect(item.patch).toBe('6.0.1.18125');
  });

  describe('Not a test', () => {
    it('force insert or update', async () => {
      environment.test = false;
      const db = new DatabaseUtil(false);
      const promiseThrottle = new PromiseThrottle({
        requestsPerSecond: 1,
        promiseImplementation: Promise
      });
      jest.setTimeout(99999999);
      let completed = 0;
      const promises = [];
      const missingFromCrafting = `
                                  SELECT *
                                  FROM (
                                  SELECT craftedItemId as id
                                  FROM recipes WHERE craftedItemId NOT IN (
                                    SELECT id FROM items
                                  )
                                  UNION ALL
                                  SELECT hordeCraftedItemId as id
                                  FROM recipes WHERE hordeCraftedItemId NOT IN (
                                    SELECT id FROM items
                                  )
                                  UNION ALL
                                  SELECT allianceCraftedItemId as id
                                  FROM recipes WHERE allianceCraftedItemId NOT IN (
                                    SELECT id FROM items
                                  )
                                  UNION ALL
                                  SELECT itemId as id
                                  FROM reagents WHERE itemId NOT IN (
                                    SELECT id FROM items
                                  )
                                  UNION ALL
                                  SELECT itemId as id
                                  FROM itemPriceHistoryPerHour
                                  WHERE ahId = 69 AND itemId NOT IN (
                                    SELECT id FROM items
                                  )) as tbl
                                  GROUP BY id
                                  ORDER BY id DESC;`;
      let ids: number[] = [];
      await db.enqueueHandshake()
        .then(async () => await db.query(missingFromCrafting).then(res => ids = res.map(id => id.id)))
        .catch(console.error);
      const start = 185100, end = start + 100000, diff = end - start;
      for (const id of ids) {
        promises.push(
          promiseThrottle.add(() => new ItemHandler()
            .addItem(id, 'en_GB', db)
            .then(item => {
              completed++;
              console.log(`Completed ${completed} / ${diff} (${
                Math.round(completed / diff * 100)}%)`);
            })
            .catch(error => {
                completed++;
                console.error(error);
              }
            )));
      }

      await Promise.all(promises)
        .then(() => console.log('Success!'))
        .catch((error) => {
          console.error(error);
        });
      db.end();
      environment.test = true;
      expect(completed).toBeGreaterThan(0);
    });

    xit('Insert missing', async () => {
      environment.test = false;
      const db = new DatabaseUtil(false);
      const promiseThrottle = new PromiseThrottle({
        requestsPerSecond: 5,
        promiseImplementation: Promise
      });
      jest.setTimeout(99999999);
      let completed = 0;

      const promises = [];
      /*
      SELECT itemId as id
      FROM reagents
      WHERE itemId NOT IN (
        SELECT id
      FROM items
    )
      GROUP BY itemId;`*/
      await db.query(`
          SELECT *
          FROM items
          WHERE timestamp < '2020-10-14 00:00:00'
          ORDER BY timestamp;
      `)
        .then(async rows => {
          rows.forEach(({id}) => promises.push(
            promiseThrottle.add(() => new ItemHandler().update(
              id
              , 'en_GB',
              db)
              .then(item => {
                completed++;
                console.log(`Completed ${completed} / ${rows.length} (${
                  Math.round(completed / rows.length * 100)}%)`);
              })
              .catch(error => {
                  completed++;
                  console.error(error);
                }
              ))));
          await Promise.all(promises)
            .then(() => console.log('Success!'))
            .catch((error) => {
              console.error(error);
            });

          db.end();
          environment.test = true;
          expect(1).toBe(2);
        });
    });
  });
});
