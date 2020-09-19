import {RecipeV2Util} from './recipev2.util';
import {Recipev2} from './recipev2.model';
import {DatabaseUtil} from '../utils/database.util';
import {QueryUtil} from '../utils/query.util';

const setKeyMap = (res: any, keyMap: {} = {}) => {
  Object.keys(res).forEach(key => {
    const type = typeof res[key];
    if (type === 'object' && key !== 'name' && key !== 'description') {
      if (res[key].forEach) {
        const arrayMap = {};
        res[key].forEach(entry =>
          setKeyMap(entry, arrayMap));
        keyMap[key] = {
          listOf: arrayMap
        };
      } else {
        keyMap[key] = setKeyMap(res[key], keyMap[key]);
      }
    } else {
      if (type === 'number' && key !== 'id') {
        if (keyMap[key]) {
          keyMap[key] = keyMap[key] < res[key] ? res[key] : keyMap[key];
        } else {
          keyMap[key] = res[key];
        }
      } else {
        keyMap[key] = type;
      }
    }
  });
  return keyMap;
};

describe('Recipev2Util', () => {
  xdescribe('Not really tests', () => {
    /*
    xit('"bruteforce" recipes', async () => {
      jest.setTimeout(10000000);
      const conn = new DatabaseUtil(false),
        increment = 200000,
        start = 1353,
        end = 50000; // start + increment;
      let completed = 0, found = 0, lastId = 0;

      for (let i = start; i < end; i++) {
        await RecipeV2Util.addToDB(i, conn)
          .then((recipe) => {
            found++;
            lastId = recipe.id;
          })
          .catch(() => {
          });
        completed++;
        console.log('Procesed', completed, '/', end - start,
          `(${((completed / (end - start)) * 100).toFixed(2)}%) id=${i
          } found=${found
          } last id was=${lastId
          }`);
      }
      conn.end();

      expect(completed).toBe(increment);
    });
  */

    xit('Add ids', async () => {
      jest.setTimeout(10000000);
      let completed = 0, found = 0, lastId = 0;
      const conn = new DatabaseUtil(false);
      const ids = [];
      for (const id of ids) {
        await RecipeV2Util.addToDB(id, conn)
          .then((recipe) => {
            found++;
            lastId = recipe.id;
          })
          .catch(() => {
          });
        completed++;
        console.log('Procesed', completed, '/', ids.length,
          `(${((completed / ids.length) * 100).toFixed(2)}%) id=${id} found=${found
          } last id was=${lastId
          }`);
      }
      conn.end();
      expect(1).toBe(1);
    });

    xit('insert all', async () => {
      jest.setTimeout(9999999);
      const db = new DatabaseUtil(false);
      await db.query(`
          SELECT data
          FROM recipe
          WHERE id NOT IN (SELECT id FROM recipes_new);`)
        .then(async r => {
          const count = r.length;
          let done = 0;

          for (const recipe of r) {
            const res: Recipev2 = JSON.parse(recipe.data);
            await RecipeV2Util.generateQuery(res)
              .then(async queries => {

                for (const q of queries) {
                  await db.query(q)
                    .catch(console.error);
                }
                done++;
              })
              .catch(console.error);
            console.log('Done', done, count, `${Math.round(done / count * 100)}%`);
          }
        })
        .catch(console.error);

      db.end();
      expect(1).toBe(2);
    });

    xit('Updating existing', async () => {
      jest.setTimeout(9999999);
      const db = new DatabaseUtil(false);
      const ids = await db.query('SELECT id FROM recipe;');
      let completed = 0;
      for (const {id} of ids) {
        await RecipeV2Util.update(id, db)
          .catch(console.error);
        completed++;
        console.log(`Progrss ${Math.round(completed / ids.length * 100)}%`, completed, ids.length);
      }
      db.end();
      expect(completed).toBe(ids.length);
    });

    xit('map all recipe keys', async () => {
      const recipes: Recipev2[] = [],
        keyMap = {};
      await new DatabaseUtil().query(`
          SELECT data
          FROM recipe;`)
        .then(r => {
          r.forEach(recipe => {
            const res: Recipev2 = JSON.parse(recipe.data);
            recipes.push(res);
            setKeyMap(res, keyMap);
          });
        })
        .catch(console.error);
      console.log('Map is', JSON.stringify(keyMap));
      expect(keyMap['crafted_quantity'].maximum).toBeTruthy();
      expect(keyMap['crafted_quantity'].minimum).toBeTruthy();
      expect(recipes.length).toBe(7339);
    });

    xit('getIcon', async () => {
      const icon = await RecipeV2Util.getIcon(1631);
      expect(icon).toBe('https://render-eu.worldofwarcraft.com/icons/56/inv_stone_sharpeningstone_01.jpg');
    });


    xit('getAndMapProfessions', async () => {
      jest.setTimeout(9999999);
      const mapped = await RecipeV2Util.getAndMapProfessions();
      // console.log('mapped', JSON.stringify(mapped));
      expect(mapped).toBeTruthy();
    });

    xit('map enchant recipes to item id', async () => {
      const type = 'Ring',
        query = `
          SELECT recipes.id as id, name.en_GB as recipeName, recipes.type as type, item.en_GB, item.id as itemId
          FROM recipes_new AS recipes
                   LEFT JOIN recipesName AS name ON name.id = recipes.id
                   LEFT JOIN professionSkillTiers as skillTier ON skillTier.id = recipes.professionSkillTierId
                   LEFT JOIN professions ON professions.id = skillTier.professionId
                   LEFT JOIN item_name_locale AS item ON item.en_GB like CONCAT('% ${type} - ', name.en_GB, '%') AND
                                                         item.en_GB NOT LIKE '%Formula%'
          WHERE professionId = 333
            AND craftedItemId is null
            AND hordeCraftedItemId IS NULL
            AND allianceCraftedItemId IS NULL
            AND recipes.type = '${type}';`;
      const conn = new DatabaseUtil(false);
      await conn.query(query)
        .then(async rows => {
          console.log('Num of rows', rows.length);
          for (const row of rows) {
            await conn.query(`
                UPDATE recipes_new
                SET craftedItemId = ${row.itemId}
                WHERE id = ${row.id}`);
          }
        })
        .catch(console.error);
      conn.end();

      expect(2).toBe(3);
    });
  });
});
