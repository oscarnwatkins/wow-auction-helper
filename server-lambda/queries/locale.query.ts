import {safeifyString} from '../utils/string.util';

export class LocaleQuery {
  public static insert(tableName: string, idName: string, data: any): string {
    return `INSERT INTO ${tableName}
        (${idName},
          en_GB,
          en_US,
          de_DE,
          es_ES,
          es_MX,
          fr_FR,
          it_IT,
          pl_PL,
          pt_PT,
          pt_BR,
          ru_RU,
          ko_KR,
          zh_TW)
        VALUES
        (${data['id']},
          "${safeifyString(data['en_GB'])}",
          "${safeifyString(data['en_US'])}",
          "${safeifyString(data['de_DE'])}",
          "${safeifyString(data['es_ES'])}",
          "${safeifyString(data['es_MX'])}",
          "${safeifyString(data['fr_FR'])}",
          "${safeifyString(data['it_IT'])}",
          "${safeifyString(data['pl_PL'])}",
          "${safeifyString(data['pt_PT'])}",
          "${safeifyString(data['pt_BR'])}",
          "${safeifyString(data['ru_RU'])}",
          "${safeifyString(data['ko_KR'])}",
          "${safeifyString(data['zh_TW'])}");`;
  }

  public static getMissingItemsLocales(localeTableName: string, locale: string): string {
    return `
      SELECT locale.id
      FROM ${localeTableName} as locale
      WHERE ${locale} IS NULL;`;
  }

  static updateSingleLocale(tableName: string, idName: string, id: any, locale: string, data: string) {
    return `UPDATE ${tableName}
            SET ${locale}='${data.replace(/[']/g, '\\\'')}'
            WHERE ${idName}=${id};`;
  }

  public static findMissingLocales(type: string): string {
    const idName = type === 'pet' ? 'speciesId' : 'id';
    return `select *
            from ${type}_name_locale
            where
              en_GB = 404 or en_GB is null or
              en_US = 404 or en_US is null or
              de_DE = 404 or de_DE is null or
              es_ES = 404 or es_ES is null or
              es_MX = 404 or es_MX is null or
              it_IT = 404 or it_IT is null or
              pl_PL = 404 or pl_PL is null or
              pt_PT = 404 or pt_PT is null or
              pt_BR = 404 or pt_BR is null or
              ru_RU = 404 or ru_RU is null or
              ko_KR = 404 or ko_KR is null or
              zh_TW = 404 or zh_TW is null or
              fr_FR = 404 or fr_FR is null
            union
            select
              ${idName},
              null as en_GB,
              null as en_US,
              null as de_DE,
              null as es_ES,
              null as es_MX,
              null as fr_FR,
              null as it_IT,
              null as pl_PL,
              null as pt_PT,
              null as pt_BR,
              null as ru_RU,
              null as ko_KR,
              null as zh_TW
            from ${type}s
            where
                ${idName} not in (select ${idName} from ${type}_name_locale);`;
  }

  public static updateTimestamp(table: string, id: number, idName: string): string {
    return `UPDATE ${table}
            SET \`timestamp\`= CURRENT_TIMESTAMP
            WHERE \`${idName}\`=${id};`;
  }
}
