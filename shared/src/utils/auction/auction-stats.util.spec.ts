import {AuctionStatsUtil} from './auction-stats.util';
import {AuctionProcessorUtil} from './auction-processor.util';
import {AuctionItemStat} from '../../models';

describe('AuctionStatsUtil', () => {
  const mock: {
    hourly: any[],
    daily: any[],
  } = {
    daily: [
      {
        ahId: 69,
        itemId: 168487,
        date: '2020-05-15',
        petSpeciesId: -1,
        bonusIds: '-1',
        minHour01: 16,
        min01: 123800,
        avg01: 165543,
        max01: 191600,
        minQuantity01: 145154,
        avgQuantity01: 336810,
        maxQuantity01: 390022,
        minHour02: 20,
        min02: 122900,
        avg02: 129044,
        max02: 167000,
        minQuantity02: 259837,
        avgQuantity02: 298151,
        maxQuantity02: 500035,
        minHour03: 0,
        min03: 133500,
        avg03: 147131,
        max03: 150000,
        minQuantity03: 152888,
        avgQuantity03: 246479,
        maxQuantity03: 269361,
        minHour04: 17,
        min04: 120000,
        avg04: 136050,
        max04: 149500,
        minQuantity04: 214541,
        avgQuantity04: 277007,
        maxQuantity04: 426488,
        minHour05: 15,
        min05: 108900,
        avg05: 156087,
        max05: 198500,
        minQuantity05: 153899,
        avgQuantity05: 448318,
        maxQuantity05: 459528,
        minHour06: 12,
        min06: 120000,
        avg06: 148150,
        max06: 156400,
        minQuantity06: 221679,
        avgQuantity06: 297354,
        maxQuantity06: 432509,
        minHour07: 11,
        min07: 130000,
        avg07: 155266,
        max07: 189000,
        minQuantity07: 108173,
        avgQuantity07: 168371,
        maxQuantity07: 298161,
        minHour08: 8,
        min08: 120000,
        avg08: 146834,
        max08: 160000,
        minQuantity08: 124650,
        avgQuantity08: 286157,
        maxQuantity08: 295349,
        minHour09: 16,
        min09: 125000,
        avg09: 144873,
        max09: 149300,
        minQuantity09: 146026,
        avgQuantity09: 345434,
        maxQuantity09: 373948,
        minHour10: 22,
        min10: 131900,
        avg10: 132812,
        max10: 145500,
        minQuantity10: 317712,
        avgQuantity10: 385192,
        maxQuantity10: 483158,
        minHour11: 20,
        min11: 115000,
        avg11: 127057,
        max11: 132900,
        minQuantity11: 239529,
        avgQuantity11: 277493,
        maxQuantity11: 505252,
        minHour12: 17,
        min12: 110000,
        avg12: 116957,
        max12: 128700,
        minQuantity12: 234259,
        avgQuantity12: 328836,
        maxQuantity12: 411715,
        minHour13: 11,
        min13: 53000,
        avg13: 125263,
        max13: 133000,
        minQuantity13: 130931,
        avgQuantity13: 217355,
        maxQuantity13: 251338,
        minHour14: 4,
        min14: 110000,
        avg14: 127141,
        max14: 129600,
        minQuantity14: 97904,
        avgQuantity14: 117521,
        maxQuantity14: 234269,
        minHour15: 17,
        min15: 109300,
        avg15: 127798,
        max15: 128500,
        minQuantity15: 127654,
        avgQuantity15: 188336,
        maxQuantity15: 208450,
        minHour16: 12,
        min16: 115000,
        avg16: 119617,
        max16: 128000,
        minQuantity16: 100690,
        avgQuantity16: 142482,
        maxQuantity16: 242552,
        minHour17: 13,
        min17: 124700,
        avg17: 148263,
        max17: 499900,
        minQuantity17: 17337,
        avgQuantity17: 371042,
        maxQuantity17: 386849,
        minHour18: 22,
        min18: 24800,
        avg18: 99262,
        max18: 148300,
        minQuantity18: 367188,
        avgQuantity18: 416136,
        maxQuantity18: 487941,
        minHour19: 14,
        min19: 115000,
        avg19: 121311,
        max19: 128700,
        minQuantity19: 251692,
        avgQuantity19: 372263,
        maxQuantity19: 543263,
        minHour20: 8,
        min20: 110000,
        avg20: 137481,
        max20: 138000,
        minQuantity20: 90109,
        avgQuantity20: 140756,
        maxQuantity20: 429042,
        minHour21: 16,
        min21: 118900,
        avg21: 124681,
        max21: 137900,
        minQuantity21: 132662,
        avgQuantity21: 577882,
        maxQuantity21: 624799,
        minHour22: 13,
        min22: 110000,
        avg22: 119607,
        max22: 124700,
        minQuantity22: 375850,
        avgQuantity22: 387578,
        maxQuantity22: 615876,
        minHour23: 18,
        min23: 110000,
        avg23: 116376,
        max23: 119900,
        minQuantity23: 317838,
        avgQuantity23: 341878,
        maxQuantity23: 491102,
        minHour24: 13,
        min24: 108700,
        avg24: 128137,
        max24: 140000,
        minQuantity24: 151333,
        avgQuantity24: 292889,
        maxQuantity24: 365587,
        minHour25: 21,
        min25: 105000,
        avg25: 119038,
        max25: 139100,
        minQuantity25: 249298,
        avgQuantity25: 307479,
        maxQuantity25: 408038,
        minHour26: 21,
        min26: 109800,
        avg26: 109918,
        max26: 130000,
        minQuantity26: 247528,
        avgQuantity26: 456374,
        maxQuantity26: 571977,
        minHour27: 12,
        min27: 100000,
        avg27: 124000,
        max27: 129600,
        minQuantity27: 209745,
        avgQuantity27: 367260,
        maxQuantity27: 418212,
        minHour28: 13,
        min28: 109000,
        avg28: 118829,
        max28: 128600,
        minQuantity28: 230078,
        avgQuantity28: 306703,
        maxQuantity28: 503704,
        minHour29: 18,
        min29: 109000,
        avg29: 115018,
        max29: 121200,
        minQuantity29: 228049,
        avgQuantity29: 296452,
        maxQuantity29: 446234,
        minHour30: 19,
        min30: 99900,
        avg30: 107558,
        max30: 121200,
        minQuantity30: 173684,
        avgQuantity30: 578713,
        maxQuantity30: 637931,
        minHour31: 14,
        min31: 100000,
        avg31: 107451,
        max31: 109600,
        minQuantity31: 546441,
        avgQuantity31: 686574,
        maxQuantity31: 781110
      },
      {
        ahId: 69,
        itemId: 168487,
        date: '2020-04-15',
        petSpeciesId: -1,
        bonusIds: '-1',
        minHour01: 6,
        min01: 289500,
        avg01: 312843,
        max01: 312900,
        minQuantity01: 130027,
        avgQuantity01: 139476,
        maxQuantity01: 257108,
        minHour02: 14,
        min02: 288700,
        avg02: 308551,
        max02: 312900,
        minQuantity02: 71395,
        avgQuantity02: 78702,
        maxQuantity02: 162795,
        minHour03: 13,
        min03: 250000,
        avg03: 287898,
        max03: 308700,
        minQuantity03: 77862,
        avgQuantity03: 129632,
        maxQuantity03: 182278,
        minHour04: 19,
        min04: 17500,
        avg04: 278904,
        max04: 299400,
        minQuantity04: 84400,
        avgQuantity04: 172607,
        maxQuantity04: 201259,
        minHour05: 11,
        min05: 50000,
        avg05: 268771,
        max05: 287900,
        minQuantity05: 122312,
        avgQuantity05: 176444,
        maxQuantity05: 227883,
        minHour06: 11,
        min06: 253000,
        avg06: 266684,
        max06: 319200,
        minQuantity06: 103379,
        avgQuantity06: 287429,
        maxQuantity06: 300120,
        minHour07: 17,
        min07: 248900,
        avg07: 249560,
        max07: 265500,
        minQuantity07: 282262,
        avgQuantity07: 340810,
        maxQuantity07: 403644,
        minHour08: 6,
        min08: 230000,
        avg08: 251807,
        max08: 254900,
        minQuantity08: 161169,
        avgQuantity08: 165992,
        maxQuantity08: 359776,
        minHour09: 19,
        min09: 238000,
        avg09: 266799,
        max09: 270000,
        minQuantity09: 125865,
        avgQuantity09: 229572,
        maxQuantity09: 262389,
        minHour10: 16,
        min10: 200000,
        avg10: 230999,
        max10: 266000,
        minQuantity10: 219022,
        avgQuantity10: 344788,
        maxQuantity10: 362981,
        minHour11: 16,
        min11: 209600,
        avg11: 226636,
        max11: 230800,
        minQuantity11: 216628,
        avgQuantity11: 270864,
        maxQuantity11: 369604,
        minHour12: 10,
        min12: 210000,
        avg12: 307718,
        max12: 350700,
        minQuantity12: 128553,
        avgQuantity12: 168379,
        maxQuantity12: 323996,
        minHour13: 21,
        min13: 219500,
        avg13: 219738,
        max13: 289900,
        minQuantity13: 132108,
        avgQuantity13: 154975,
        maxQuantity13: 268909,
        minHour14: 0,
        min14: 209700,
        avg14: 228631,
        max14: 289000,
        minQuantity14: 75275,
        avgQuantity14: 383768,
        maxQuantity14: 410352,
        minHour15: 10,
        min15: 229000,
        avg15: 235595,
        max15: 236000,
        minQuantity15: 261690,
        avgQuantity15: 305100,
        maxQuantity15: 411059,
        minHour16: 13,
        min16: 210000,
        avg16: 233920,
        max16: 235900,
        minQuantity16: 241874,
        avgQuantity16: 280383,
        maxQuantity16: 455909,
        minHour17: 15,
        min17: 198700,
        avg17: 207889,
        max17: 233900,
        minQuantity17: 270083,
        avgQuantity17: 351709,
        maxQuantity17: 373452,
        minHour18: 14,
        min18: 197800,
        avg18: 201640,
        max18: 207900,
        minQuantity18: 166835,
        avgQuantity18: 272480,
        maxQuantity18: 342421,
        minHour19: 12,
        min19: 190000,
        avg19: 203215,
        max19: 204300,
        minQuantity19: 221125,
        avgQuantity19: 322698,
        maxQuantity19: 456568,
        minHour20: 20,
        min20: 187500,
        avg20: 188773,
        max20: 203900,
        minQuantity20: 205508,
        avgQuantity20: 250853,
        maxQuantity20: 315974,
        minHour21: 7,
        min21: 20000,
        avg21: 186871,
        max21: 200000,
        minQuantity21: 213807,
        avgQuantity21: 384193,
        maxQuantity21: 415419,
        minHour22: 0,
        min22: 152900,
        avg22: 232298,
        max22: 357900,
        minQuantity22: 110607,
        avgQuantity22: 271156,
        maxQuantity22: 364882,
        minHour23: 17,
        min23: 183200,
        avg23: 184558,
        max23: 229500,
        minQuantity23: 190738,
        avgQuantity23: 205000,
        maxQuantity23: 275979,
        minHour24: 16,
        min24: 80500,
        avg24: 178796,
        max24: 184500,
        minQuantity24: 162197,
        avgQuantity24: 417309,
        maxQuantity24: 450220,
        minHour25: 12,
        min25: 60000,
        avg25: 158724,
        max25: 180000,
        minQuantity25: 445879,
        avgQuantity25: 517545,
        maxQuantity25: 553807,
        minHour26: 10,
        min26: 60000,
        avg26: 158125,
        max26: 170000,
        minQuantity26: 286996,
        avgQuantity26: 304531,
        maxQuantity26: 472249,
        minHour27: 19,
        min27: 35600,
        avg27: 150678,
        max27: 158800,
        minQuantity27: 266398,
        avgQuantity27: 316855,
        maxQuantity27: 384634,
        minHour28: 16,
        min28: 119700,
        avg28: 142739,
        max28: 157300,
        minQuantity28: 288783,
        avgQuantity28: 319280,
        maxQuantity28: 487676,
        minHour29: 14,
        min29: 139000,
        avg29: 148705,
        max29: 157000,
        minQuantity29: 235810,
        avgQuantity29: 391548,
        maxQuantity29: 399005,
        minHour30: 17,
        min30: 123400,
        avg30: 124845,
        max30: 149600,
        minQuantity30: 398366,
        avgQuantity30: 480613,
        maxQuantity30: 549836,
        minHour31: null,
        min31: null,
        avg31: null,
        max31: null,
        minQuantity31: null,
        avgQuantity31: null,
        maxQuantity31: null
      }
    ],
    hourly: [
      {
        ahId: 69,
        itemId: 168487,
        date: '2020-09-25',
        petSpeciesId: -1,
        bonusIds: '-1',
        price00: 30000,
        quantity00: 276704,
        price01: null,
        quantity01: null,
        price02: null,
        quantity02: null,
        price03: 30000,
        quantity03: 266359,
        price04: 30000,
        quantity04: 257145,
        price05: 30000,
        quantity05: 250617,
        price06: 30000,
        quantity06: 245009,
        price07: 30000,
        quantity07: 239996,
        price08: 30000,
        quantity08: 224656,
        price09: 30000,
        quantity09: 226202,
        price10: 29000,
        quantity10: 223580,
        price11: 25000,
        quantity11: 221074,
        price12: 30000,
        quantity12: 213737,
        price13: 25000,
        quantity13: 213234,
        price14: 30000,
        quantity14: 209485,
        price15: 29900,
        quantity15: 208572,
        price16: 18700,
        quantity16: 220412,
        price17: 18700,
        quantity17: 236097,
        price18: 18700,
        quantity18: 228011,
        price19: 18000,
        quantity19: 235944,
        price20: null,
        quantity20: null,
        price21: null,
        quantity21: null,
        price22: null,
        quantity22: null,
        price23: null,
        quantity23: null
      },
      {
        ahId: 69,
        itemId: 168487,
        date: '2020-09-24',
        petSpeciesId: -1,
        bonusIds: '-1',
        price00: 40700,
        quantity00: 58306,
        price01: 40500,
        quantity01: 64600,
        price02: 40000,
        quantity02: 64605,
        price03: 40000,
        quantity03: 64622,
        price04: 40000,
        quantity04: 68488,
        price05: 40000,
        quantity05: 64892,
        price06: 40000,
        quantity06: 62693,
        price07: 39500,
        quantity07: 61842,
        price08: 39400,
        quantity08: 56279,
        price09: 39400,
        quantity09: 48168,
        price10: 39400,
        quantity10: 44090,
        price11: 25400,
        quantity11: 70780,
        price12: 25400,
        quantity12: 79993,
        price13: 30000,
        quantity13: 109389,
        price14: 39300,
        quantity14: 136338,
        price15: 39000,
        quantity15: 216170,
        price16: 36500,
        quantity16: 219727,
        price17: 36500,
        quantity17: 234640,
        price18: 35000,
        quantity18: 261034,
        price19: 34900,
        quantity19: 278039,
        price20: 31500,
        quantity20: 264549,
        price21: 30000,
        quantity21: 274597,
        price22: 30000,
        quantity22: 275417,
        price23: 30000,
        quantity23: 278449
      }
    ]
  };
  describe('processDaily', () => {
    it('Should not contain more than 24 hours', () => {
      const result = AuctionStatsUtil.processHours(mock.hourly);
      expect(result.length).toBe(1);
    });
  });

  describe('getDailyColumnsSince', () => {
    it('Can get past 7 days within the same month', () => {
      const {
        columns,
        months
      } = AuctionProcessorUtil.getDailyColumnsSince(7, new Date(575375889600000)); // '20202-12-9'
      expect(columns.length).toBe(7);
      expect(columns[0]).toBe('min02, avg02, avgQuantity02');
      expect(columns[6]).toBe('min08, avg08, avgQuantity08');
      expect(months.length).toBe(1);
      expect(months[0]).toEqual("'20202-12-15'");
    });

    it('Can get past 7 days within the different months', () => {
      const {
        columns,
        months
      } = AuctionProcessorUtil.getDailyColumnsSince(7, new Date(575375371200000)); // '20202-12-3'
      expect(columns.length).toBe(7);
      expect(columns[0]).toBe('min26, avg26, avgQuantity26');
      expect(columns[6]).toBe('min02, avg02, avgQuantity02');
      expect(months.length).toBe(2);
      expect(months[0]).toBe("'20202-11-15'");
      expect(months[1]).toBe("'20202-12-15'");
    });
  });

  it('Can split array into chunks', () => {
    const list: AuctionItemStat[] = [];

    for (let i = 0; i < 23000; i++) {
      list.push({
        itemId: 1,
        petSpeciesId: 1,
        date: '',
      } as AuctionItemStat);
    }

    const result = AuctionProcessorUtil.splitEntries<AuctionItemStat>(list);
    expect(result.length).toBe(5);
    expect(result[0].length).toBe(5000);
    expect(result[4].length).toBe(3000);
  });
});