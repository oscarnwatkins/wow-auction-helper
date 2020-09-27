import {DashboardV2} from '../models/dashboard-v2.model';
import {ConditionEnum} from '../types/condition.enum';
import {TargetValueEnum} from '../types/target-value.enum';
import {columnConfig} from './columns.data';
import {Profession} from '../../../../../../api/src/profession/model';

const profitableCrafts: DashboardV2 = {
  id: 'default-profitable-crafts',
  idIsBackendGenerated: false,
  sortOrder: 0,
  idParam: 'id',
  title: 'Profitable crafts',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.buyout,
    columnConfig.recipe.rank,
    columnConfig.recipe.ROI,
    columnConfig.recipe.ROIPercent,
    columnConfig.recipe.cost,
    columnConfig.auction.regionSaleRate,
    columnConfig.item.itemLevel,
    columnConfig.shoppingCartInput
  ],
  sortRule: {
    field: columnConfig.recipe.ROI.key,
    sortDesc: true
  },
  rules: [{
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.buyout.key,
    toValue: 110,
    toField: columnConfig.recipe.cost.key
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.regionSaleRate.key,
    toValue: 15
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.NUMBER,
    field: columnConfig.auction.avgDailySold.key,
    toValue: 1
  }],
  data: [],
  lastModified: 1595541600000
};

const profitableKnownCrafts: DashboardV2 = {
  id: 'default-profitable-known-crafts',
  idIsBackendGenerated: false,
  sortOrder: 1,
  idParam: 'id',
  title: 'Profitable known crafts',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.buyout,
    columnConfig.recipe.knownRank,
    columnConfig.recipe.knownROI,
    columnConfig.recipe.knownROIPercent,
    columnConfig.recipe.knownCost,
    columnConfig.auction.regionSaleRate,
    columnConfig.item.itemLevel,
    columnConfig.shoppingCartInput
  ],
  sortRule: {
    field: columnConfig.recipe.knownROI.key,
    sortDesc: true
  },
  rules: [{
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.buyout.key,
    toValue: 110,
    toField: columnConfig.recipe.knownCost.key
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.regionSaleRate.key,
    toValue: 15
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.NUMBER,
    field: columnConfig.auction.avgDailySold.key,
    toValue: 1
  }],
  data: [],
  lastModified: 1595541600000
};

const potentialDeals: DashboardV2 = {
  id: 'default-potential-deals',
  idIsBackendGenerated: false,
  sortOrder: 2,
  idParam: 'id',
  title: 'Potential deals',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.mktPrice,
    columnConfig.auction.buyout,
    columnConfig.auction.mktPriceMinusBuyout,
    columnConfig.item.vendorSell,
    columnConfig.auction.avgDailySold,
    columnConfig.auction.regionSaleRate,
    columnConfig.auction.regionSaleAvg,
  ],
  sortRule: {
    field: 'mktPrice-buyout',
    sortDesc: true
  },
  rules: [{
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.NUMBER,
    field: 'quality',
    toValue: 0
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: 'regionSaleRate',
    toValue: 30
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.NUMBER,
    field: 'avgDailySold',
    toValue: 1
  }, {
    condition: ConditionEnum.LESS_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: 'buyout',
    toValue: 75,
    toField: 'mktPrice'
  }, {
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'buyout',
    toValue: '0c'
  }],
  data: [],
  lastModified: 1595541600000
};

const potentialBidDeals: DashboardV2 = {
  id: 'default-potential-bid-deals',
  idIsBackendGenerated: false,
  sortOrder: 3,
  idParam: 'id',
  title: 'Potential bid deals',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.auctionsBid,
    columnConfig.auction.buyout,
    columnConfig.auction.auctionsBidMinusBuyout,
    columnConfig.item.vendorSell,
    columnConfig.auction.quantity,
    columnConfig.auction.timeLeft
  ],
  sortRule: {
    field: columnConfig.auction.auctionsBidMinusBuyout.key,
    sortDesc: true
  },
  rules: [
    {
      condition: ConditionEnum.LESS_THAN_OR_EQUAL_TO,
      targetValueType: TargetValueEnum.PERCENT,
      field: 'bid',
      toValue: .9,
      toField: 'buyout',
    }, {
      condition: ConditionEnum.GREATER_THAN,
      targetValueType: TargetValueEnum.GOLD,
      field: 'bid',
      toValue: '0c'
    },
    {
      condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
      targetValueType: TargetValueEnum.PERCENT,
      field: 'regionSaleRate',
      toValue: 30
    }, {
      condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
      targetValueType: TargetValueEnum.NUMBER,
      field: 'avgDailySold',
      toValue: 1
    }, {
      condition: ConditionEnum.GREATER_THAN,
      targetValueType: TargetValueEnum.NUMBER,
      field: 'quality',
      toValue: 0
    }, {
      condition: ConditionEnum.GREATER_THAN,
      targetValueType: TargetValueEnum.GOLD,
      field: '[auctions].bid',
      toValue: '0c'
    }, {
      condition: ConditionEnum.LESS_THAN,
      targetValueType: TargetValueEnum.PERCENT,
      field: '[auctions].bid',
      toValue: 90,
      toField: 'buyout'
    }],
  data: [],
  lastModified: 1595541600000
};

const potentialBidDealsWith2HOrLessLeft: DashboardV2 = {
  id: 'default-potential-bid-deals-with-2hours-or-less',
  idIsBackendGenerated: false,
  sortOrder: 4,
  idParam: 'id',
  title: 'Potential 2 hour bid deals',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.bid,
    columnConfig.auction.buyout,
    columnConfig.auction.auctionsBidMinusBuyout,
    columnConfig.item.vendorSell,
    columnConfig.auction.quantity,
    columnConfig.auction.timeLeft
  ],
  sortRule: {
    field: columnConfig.auction.auctionsBidMinusBuyout.key,
    sortDesc: true
  },
  rules: [...potentialBidDeals.rules, {
    condition: ConditionEnum.EQUAL_TO,
    targetValueType: TargetValueEnum.TEXT,
    field: '[auctions].timeLeft',
    toValue: 'MEDIUM',
    or: [
      {
        condition: ConditionEnum.EQUAL_TO,
        targetValueType: TargetValueEnum.TEXT,
        field: '[auctions].timeLeft',
        toValue: 'SHORT'
      }
    ]
  }],
  data: [],
  lastModified: 1595541600000
};

const buyoutBelowVendorSellPrice: DashboardV2 = {
  id: 'default-buyout-below-vendor-sell-price',
  idIsBackendGenerated: false,
  sortOrder: 6,
  idParam: 'id',
  title: 'Buyout below vendor sell price',
  columns: [
    columnConfig.item.name,
    columnConfig.auction.buyout,
    columnConfig.item.vendorSell,
    columnConfig.auction.buyoutVsVendorSell,
  ],
  sortRule: {
    field: 'buyout',
    sortDesc: true
  },
  rules: [{
    condition: ConditionEnum.LESS_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'buyout',
    toField: 'vendorSell'
  }, {
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'buyout',
    toValue: '0c'
  }, {
    condition: ConditionEnum.IS_NOT,
    targetValueType: TargetValueEnum.NUMBER,
    field: 'item.itemClass',
    toValue: 4
  }, {
    condition: ConditionEnum.IS_NOT,
    targetValueType: TargetValueEnum.NUMBER,
    field: 'item.itemClass',
    toValue: 2
  }],
  data: [],
  lastModified: 1595541600000
};

const tradeVendorCurrencyInGold: DashboardV2 = {
  id: 'default-trade-vendor-currency-in-gold',
  idIsBackendGenerated: false,
  sortOrder: 6,
  idParam: 'id',
  title: 'Trade vendor currency in gold',
  sortRule: {
    field: 'source.tradeVendor.roi',
    sortDesc: true
  },
  columns: [
    {
      key: 'name', title: 'Currency', dataType: 'name', options: {
        idName: 'source.tradeVendor.sourceID'
      }
    },
    {
      key: 'source.tradeVendor.bestValueName', title: 'Target', dataType: 'name', options: {
        idName: 'source.tradeVendor.itemID'
      }
    },
    {key: 'source.tradeVendor.roi', title: 'ROI', dataType: 'gold'},
    {key: 'source.tradeVendor.value', title: 'Value', dataType: 'gold'},
    {key: 'source.tradeVendor.sourceBuyout', title: 'Currency buyout', dataType: 'gold'},
    {key: 'source.tradeVendor.buyout', title: 'Buyout', dataType: 'gold'}
  ],
  rules: [{
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'source.tradeVendor.sourceBuyout',
    toValue: '0c',
  }, {
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'source.tradeVendor.value',
    toValue: '0c',
  }, {
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.GOLD,
    field: 'source.tradeVendor.roi',
    toValue: '0c',
  }, {
    condition: ConditionEnum.GREATER_THAN,
    targetValueType: TargetValueEnum.PERCENT,
    field: 'regionSaleRate',
    toValue: 10,
  }],
  data: [],
  lastModified: 1595541600000
};

const getKnownProfessionBoards = (professions: Profession[]): DashboardV2[] => professions.map(p => (
  {
  id: 'default-get-known-profession-' + p.id,
  idIsBackendGenerated: false,
  sortOrder: 1,
  idParam: 'id',
  title: p.name,
  columns: profitableKnownCrafts.columns,
  sortRule: {
    field: columnConfig.recipe.knownROI.key,
    sortDesc: true
  },
  rules: [{
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.buyout.key,
    toValue: 110,
    toField: columnConfig.recipe.knownCost.key
  }, {
    condition: ConditionEnum.EQUAL_TO,
    targetValueType: TargetValueEnum.NUMBER,
    field: columnConfig.recipe.knownProfession.key,
    toValue: p.id
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.PERCENT,
    field: columnConfig.auction.regionSaleRate.key,
    toValue: 15
  }, {
    condition: ConditionEnum.GREATER_THAN_OR_EQUAL_TO,
    targetValueType: TargetValueEnum.NUMBER,
    field: columnConfig.auction.avgDailySold.key,
    toValue: 1
  }],
  data: [],
  lastModified: 1595541600000
}));

export const getDefaultDashboards = (professions: Profession[]): DashboardV2[] => [
  profitableCrafts,
  profitableKnownCrafts,
  ...getKnownProfessionBoards(professions),
  potentialDeals,
  potentialBidDeals,
  potentialBidDealsWith2HOrLessLeft,
  buyoutBelowVendorSellPrice,
  tradeVendorCurrencyInGold
];