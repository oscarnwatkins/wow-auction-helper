import {DatabaseUtil} from '../../../utils/database.util';
import {AuctionItemStat, AuctionItemStatDays} from '../../../shared/models';
import {AuctionProcessorUtil} from '../../../shared/utils';
import {RDSQueryUtil} from '../../../utils/query.util';
import {RealmRepository} from '../../realm/repositories/realm.repository';
import {DATABASE_CREDENTIALS} from '../../../secrets';


class Migrate {
  constructor(
    public table: string,
    public querySuffix: string = '',
    public multiInsert: boolean = true,
    public hasIdColumn: boolean = true,
    public idColumnName: string = 'id',
  ) {
  }

  setHasIdColumn(hasIdColumn: boolean): this {
    this.hasIdColumn = hasIdColumn;
    return this;
  }

  setIdColumnName(idColumnName: string): this {
    this.idColumnName = idColumnName;
    return this;
  }
}
/**
 * This file is basically used as a script to import data from the local DB to the one in AWS.
 */
export class StatsMigrationToolUtil {
  private source: DatabaseUtil;
  private target: DatabaseUtil;
  private util: RDSQueryUtil<unknown>;
  private readonly table: string;

  constructor() {
    // this.table = 'itemPriceHistoryPerHour';
    this.table = 'itemPriceHistoryPerDay';
    this.target = new DatabaseUtil(false, false, {
      database: DATABASE_CREDENTIALS.READ.database,
      host: DATABASE_CREDENTIALS.READ.host,
      user: DATABASE_CREDENTIALS.READ.user,
      password: DATABASE_CREDENTIALS.READ.password
    });
    this.source = new DatabaseUtil(false, false, {
      database: 'wah',
      host: DATABASE_CREDENTIALS.LOCALHOST.host,
      user: DATABASE_CREDENTIALS.LOCALHOST.user,
      password: DATABASE_CREDENTIALS.LOCALHOST.password
    });
    this.util = new RDSQueryUtil(this.table);
  }
  numberToString(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }

  getDate(year: number, month: number, day: number): string {
    return `${year}-${this.numberToString(month)}-${this.numberToString(day)}`;
  }

  end() {
    this.target.end();
    this.source.end();
  }

  private getAllForRealmAndDate(ahId: number, year: number, month: number, day: number): Promise<AuctionItemStat[]> {
    const query = `
      SELECT *
      FROM ${this.table}
      WHERE ahId = ${ahId} AND date = '${this.getDate(year, month, day)}';
    `;
    return this.source.query(query);
  }

  private getAllForRealmAndMonth(ahId: number, year: number, month: number): Promise<AuctionItemStatDays[]> {
    /*
    Used for getting a partial period
    const columns = AuctionProcessorUtil.getDailyColumnsSince(
      14, new Date('01/16/2021'), true).columns.join(', ');

    date, ahId, itemId, petSpeciesId, bonusIds, ${columns}
    */
    return this.source.query(`
      SELECT *
      FROM ${this.table}
      WHERE ahId = ${ahId} AND date = '${year}-${month}-15';;
    `);
  }

  private cleanAndInsertData(list: any[], year: number, month: number, day: number = 15): Promise<void> {
    const splitList = AuctionProcessorUtil.splitEntries(list.map(original => ({
      ...original,
      date: this.getDate(year, month, day)
    })));
    return new Promise<void>((resolve, reject) => {
      Promise.all(
        splitList.map(rows =>
          this.target.query(this.util.multiInsertOrUpdate(rows, false))))
        .then((ok) => {
          resolve();
        })
        .catch(reject);
    });
  }

  migrate(ahId: number, year: number, month: number, day: number = 15): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.enqueueHandshakes()
        .then(() => {
          // this.getAllForRealmAndDate(ahId, year, month, day)
          this.getAllForRealmAndMonth(ahId, year, month)
            .then(result => {
              this.cleanAndInsertData(result, year, month, day)
                .then(() => resolve())
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  migrateTables(tables: Migrate[] = [
    /*
    new Migrate('zone', 'order by id desc', false),
    new Migrate('zoneName', 'order by id desc', false),

    new Migrate('professions'),
    new Migrate('professionsDescription'),
    new Migrate('professionsName'),
    new Migrate('professionSkillTiers'),
    new Migrate('professionSkillTiersName'),


    new Migrate('recipes'),
    new Migrate('recipesName'),
    new Migrate('recipesClassic'),
    new Migrate('recipesClassicName'),
    new Migrate('recipesBonusId').setHasIdColumn(false),
    new Migrate('recipesDescription'),
    new Migrate('recipesModifiedCraftingSlot'),
    new Migrate('reagents').setHasIdColumn(false),
    new Migrate('reagentsClassic').setHasIdColumn(false),

    new Migrate('pets').setIdColumnName('speciesId'),
    new Migrate(`pet_name_locale`).setIdColumnName('speciesId'),

    new Migrate('npc'),
    new Migrate(`npcCoordinates`),
    new Migrate(`npcDrops`),
    new Migrate(`npcName`),
    new Migrate(`npcSells`),
    new Migrate(`npcSkins`),
    new Migrate(`npcTag`),

    new Migrate('itemsClassic', 'order by id desc', false),
    new Migrate('itemClassic_name_locale'),

    new Migrate('items', 'order by id desc', false),
    new Migrate('item_name_locale'),
     */
    new Migrate('itemsClassic', 'order by id desc', false),
    new Migrate('itemClassic_name_locale'),

    new Migrate('items', 'order by id desc', false),
    new Migrate('item_name_locale'),
  ]): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      if (process.env.IS_OFFLINE) {
        this.enqueueHandshakes()
          .then(async () => {
            let rowsToInsert = [];
            const queries = [];
            for (const {idColumnName, table, querySuffix, multiInsert, hasIdColumn} of tables) {
              console.log('Starting to process', table);
              const util = new RDSQueryUtil(table, false);
              const existingIds = [];
              let hasHadError = false;

              if (hasIdColumn) {
                await this.target.query(`select ${idColumnName} from ${table}`)
                  .then(ids => ids.forEach(({id}) => existingIds.push(id)));
              }
              const notExistsIn = hasIdColumn && existingIds.length ? ` where ${idColumnName} not in (${existingIds.join(',')})` : '';
              const querySuffixHasWhere = (querySuffix || '').indexOf('where ') > -1;
              const where = querySuffixHasWhere ? querySuffix : notExistsIn;
              await this.source.query(`
                    select *
                    from ${table}
                    ${where} ${querySuffixHasWhere ? '' : querySuffix}
              `)
                .then(rows => {
                  rowsToInsert = rows;
                  console.log('Rows to insert: ', rows.length);
                })
                .catch(error => {
                  console.log('Could not get data:', error);
                });
              let count = 0;
              for (const part of AuctionProcessorUtil.splitEntries(rowsToInsert)) {
                if (multiInsert) {
                  const query = util.multiInsertOrUpdate(part, false);
                  queries.push(query);
                  await this.target.query(query)
                    .catch(error => {
                      console.error('Could not insert', error);
                      hasHadError = true;
                    });
                } else {
                  for (const row of part) {
                    if (!hasHadError) {
                      count++;
                      console.log(`Progress: ${
                        Math.round((count / rowsToInsert.length) * 100)}% (${
                        count} of ${rowsToInsert.length}) - ${table}`);
                      const query = util.insertOrUpdate(row, false);
                      queries.push(query);
                      await this.target.query(query)
                        .catch(error => {
                          console.error('Could not insert', query, error);
                          hasHadError = true;
                        });
                    }
                  }
                }
              }
            }

            this.source.end();
            this.target.end();
            resolve(queries);
          });
      } else {
        resolve([]);
      }
    });
  }

  private enqueueHandshakes() {
    return Promise.all([
      this.source.enqueueHandshake(),
      this.target.enqueueHandshake()
    ]);
  }

  async performMigrationForAllRealms() {
    const realmRepo = new RealmRepository();
    const ahs = await realmRepo.getAll();
    const startDay = 7;
    const endDay = 7;
    const numberOfDays = endDay - startDay;
    let completed = 0;
    let completedAhs = 0;
    const list = ahs.filter(a => a.id > 13)
      .sort((a, b) => a.id - b.id)
      .slice(0, 4);
    const totalNumberOfAhDaysToImport = (numberOfDays || 1) * list.length;
    for (const ah of list) {
      completedAhs++;
      for (let day = startDay; day <= endDay; day++) {
        // await this.migrate(ah.id, 2022, 7, day);
        await this.migrate(ah.id, 2022, day);

        completed++;
        console.log(`Processing id=${ah.id} -  ${
          completedAhs} of ${list.length} @ day ${day} - (${
          Math.round((completed / totalNumberOfAhDaysToImport * 100 + Number.EPSILON) * 100) / 100
        }%)`);
      }
    }
    this.end();
  }
}