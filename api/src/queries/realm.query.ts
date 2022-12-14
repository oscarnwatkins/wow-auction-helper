import {DatabaseUtil} from '../utils/database.util';

interface RealmsForHouseResult {
  id: number;
  connectedId: number;
  region: string;
  slug: string;
  name: string;
  connectedTo: string | string[];
  url: string;
  tsmUrl: string;
  lastModified: string;
  isUpdating: number;
  isActive: number;
  autoUpdate: number;
  size: number;
  lowestDelay: number;
  avgDelay: number;
  highestDelay: number;
  firstRequested: number;
  lastRequested: number;
}

export class RealmQuery {
  static getUpdateHistoryForRealm(ahId: number, sinceTimestamp: number): string {
    return `SELECT *
            FROM auction_houses_dump_log
            WHERE ahId = ${ahId} AND lastModified >= ${sinceTimestamp} AND timeSincePreviousDump > 0
            ORDER BY lastModified desc;`;
  }

  static insertHouse(house): string {
    return `INSERT INTO \`wah\`.\`auction_houses\`
                  (\`region\`,
                  \`isUpdating\`,
                  \`isActive\`,
                  \`autoUpdate\`)
                  VALUES
                  ("${house.region}",
                  0,
                  1,
                  1);`;
  }

  static insertRealm(realm): string {
    return `INSERT INTO \`wah\`.\`auction_house_realm\`
              (\`ahId\`,
              \`slug\`,
              \`name\`,
              \`battlegroup\`,
              \`timezone\`,
              \`locale\`)
              VALUES
              (${realm.ahId},
              "${realm.slug}",
              "${realm.name}",
              "${realm.battlegroup}",
              "${realm.timezone}",
              "${realm.locale}");`;
  }

  static getAllMinimal(): string {
    return `SELECT ah.id as id, region, slug, connectedId
            FROM auction_houses as ah
                     LEFT OUTER JOIN (
                SELECT ahId, slug, name
                FROM auction_house_realm
                GROUP BY ahId) as realm
                                     ON ah.id = realm.ahId
            WHERE ah.id = realm.ahId
              AND connectedId IS NULL
            ORDER BY lastRequested DESC;`;
  }

  static getAll(): string {
    return `SELECT ahId,
                   connectedId,
                   region,
                   slug,
                   name,
                   battlegroup,
                   locale,
                   timezone,
                   ah.url          as url,
                   ah.lastModified as lastModified,
                   lowestDelay,
                   avgDelay,
                   highestDelay,
                   ah.size         as size,
                   tsm.url         as tsmUrl,
                   ah.autoUpdate   as autoUpdate
            FROM auction_house_realm AS realm
                     LEFT OUTER JOIN auction_houses AS ah
                                     ON ah.id = realm.ahId
                     LEFT OUTER JOIN tsmDump AS tsm
                                     ON tsm.id = realm.ahId
            ORDER BY name;`;
  }

  static getAllHouses(): string {
    return `SELECT ah.id,
                   connectedId as id,
                   region,
                   slug,
                   name,
                   url,
                   lastModified,
                   lowestDelay,
                   avgDelay,
                   highestDelay
            FROM auction_houses as ah
                     LEFT OUTER JOIN (
                SELECT ahId, slug, name
                FROM auction_house_realm
                GROUP BY ahId) as realm
                                     ON ah.id = realm.ahId
            WHERE ah.id = realm.ahId;`;
  }

  /*
  * Updating Any house that probably has an update incoming or that has not received an update in 1 day
  */
  static selectAllUpdatableRealms() {
    return `SELECT ah.id                                                             as id,
                   connectedId,
                   region,
                   slug,
                   name,
                   url,
                   lastModified,
                   lowestDelay,
                   avgDelay,
                   highestDelay,
                   (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - lastModified) / 60000 as timeSince,
                   timestamp
            FROM auction_houses as ah
                     LEFT OUTER JOIN (
                SELECT ahId, slug, name
                FROM auction_house_realm
                GROUP BY ahId) as realm
                                     ON ah.id = realm.ahId
                     LEFT JOIN (
                SELECT realm.ahId as ahId, MAX(timestamp) AS timestamp
                FROM \`s3-logs\` as logs
                         JOIN (
                    SELECT realm.ahId as ahId, house.region as region, slug, name, locale, timeZone
                    FROM auction_house_realm AS realm
                             LEFT JOIN auction_houses AS house ON house.id = realm.ahId
                ) as realm ON CONCAT(realm.slug, '.json.gz') = fileName
                WHERE timestamp >= NOW() - INTERVAL 24 HOUR
                  AND logs.ahId IS NULL
                  AND fileName NOT LIKE 'status.json.gz'
                GROUP BY logs.region, slug
            ) as log ON log.ahId = ah.id
            WHERE isActive = 1
              AND name IS NOT NULL
              AND (
                    (
                            autoUpdate = 1 AND FROM_UNIXTIME(lastModified / 1000) <= NOW() - INTERVAL lowestDelay MINUTE
                        )
                    OR (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - lastModified) / 60000 / 60 / 4 > 1
                )
            ORDER BY timestamp DESC, autoUpdate DESC, (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - lastModified) / 60000 DESC
            LIMIT 50;`;
  }

  static insertNewDumpLogRow(ahId: number, url: string, lastModified: number, oldLastModified: number, size: number): string {
    return `INSERT INTO \`wah\`.\`auction_houses_dump_log\`
              (\`ahId\`,
              \`lastModified\`,
              \`url\`,
              \`timeSincePreviousDump\`,
              \`size\`)
              VALUES
              (
              ${ahId},
              ${lastModified},
              "${url}",
              ${lastModified - oldLastModified},
              ${size});`;
  }

  static updateUrl(ahId: number, url: string, lastModified: number, size: number,
                   delay: { avg: number; highest: number; lowest: number }): string {
    return `UPDATE \`wah\`.\`auction_houses\`
            SET
              \`url\` = "${url}",
              \`lastModified\` = ${lastModified},
              \`isUpdating\` = 0,
              \`size\` = ${size},
              \`lowestDelay\` = ${delay.lowest},
              \`avgDelay\` = ${delay.avg},
              \`highestDelay\` = ${delay.highest}
                WHERE \`id\` = ${ahId};`;
  }

  static getHouse(id: number, limit = 1): string {
    return `SELECT ahId as id, connectedId, region, slug, name, battlegroup, locale, timezone, url, lastModified
            FROM auction_house_realm as realm
            LEFT OUTER JOIN auction_houses as ah
            ON ah.id = realm.ahId
            WHERE ahid = ${id}
            ${limit ? `LIMIT ${limit}` : ''};`;
  }

  static getHouseForRealm(region: string, realmSlug: string): string {
    return `SELECT ah.id                  as id,
                   ah.connectedId         as connectedId,
                   region,
                   slug,
                   name,
                   connectedRealms.realms as connectedTo,
                   ah.url                 as url,
                   tsm.url                as tsmUrl,
                   ah.lastModified        as lastModified,
                   isUpdating,
                   isActive,
                   autoUpdate,
                   size,
                   lowestDelay,
                   avgDelay,
                   highestDelay,
                   firstRequested,
                   lastRequested
            FROM auction_houses as ah
                     LEFT OUTER JOIN tsmDump as tsm ON ah.id = tsm.id
                     LEFT OUTER JOIN auction_house_realm as realm ON realm.ahId = ah.id
                     LEFT OUTER JOIN (
                SELECT ahId,
                       connectedId,
                       Group_CONCAT(slug) as realms
                FROM auction_house_realm
                         LEFT JOIN auction_houses as ah ON ah.id = ahId
                GROUP BY connectedId
            ) as connectedRealms ON connectedRealms.ahId = ah.id
            WHERE slug = "${realmSlug}"
              AND region = "${region}";`;
  }

  static getAllRealmsForHouse(id: number, conn: DatabaseUtil): Promise<RealmsForHouseResult[]> {
    return conn.query(`
        SELECT *
        FROM (SELECT ah.id                  AS id,
                     ah.connectedId         AS connectedId,
                     region,
                     slug,
                     name,
                     connectedRealms.realms AS connectedTo,
                     ah.url                 AS url,
                     tsm.url                AS tsmUrl,
                     ah.lastModified        AS lastModified,
                     isUpdating,
                     isActive,
                     autoUpdate,
                     size,
                     lowestDelay,
                     avgDelay,
                     highestDelay,
                     firstRequested,
                     lastRequested
              FROM auction_houses AS ah
                       LEFT OUTER JOIN
                   tsmDump AS tsm ON ah.id = tsm.id
                       LEFT OUTER JOIN
                   auction_house_realm AS realm ON realm.ahId = ah.id
                       LEFT OUTER JOIN
                   (SELECT ahId,
                           connectedId,
                           GROUP_CONCAT(slug) AS realms
                    FROM auction_house_realm
                             LEFT JOIN auction_houses AS ah ON ah.id = ahId
                    GROUP BY connectedId) AS connectedRealms ON connectedRealms.ahId = ah.id
             ) as tbl
        WHERE slug IS NOT NULL
          AND id = ${id};`);
  }

  static isUpdating(id: number, isUpdating: boolean) {
    return `UPDATE \`wah\`.\`auction_houses\`
            SET
              \`isUpdating\` = ${isUpdating ? 1 : 0}
                WHERE \`id\` = ${id};`;
  }

  static activateHouse(id: any): string {
    return `UPDATE \`wah\`.\`auction_houses\`
            SET
              \`firstRequested\` = ${+new Date()},
              \`lastRequested\` = ${+new Date()},
              \`autoUpdate\` = 1
                WHERE \`id\` = ${id};`;
  }

  static updateLastRequested(id: any): string {

    return `UPDATE \`wah\`.\`auction_houses\`
            SET
              \`lastRequested\` = ${+new Date()}
                WHERE \`id\` = ${id};`;
  }

  static setNonRequestedHousesToNotAutoUpdate(days: number): string {
    return `UPDATE auction_houses as ah
            SET autoUpdate = 0
            WHERE (ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) - lastRequested) / 60000 / 60 / 24 > ${days}
                AND autoUpdate = 1;`;
  }
}
