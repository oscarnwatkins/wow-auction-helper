export class GameBuild {

  /**
   * The version of the game client that the user uses
   */
  static readonly versions = [
    'Retail',
    'Classic'
  ];

  static readonly ADDONS = {
    AHDB: {file: 'AuctionDB.lua', name: 'AHDB'},
    AuctioneerClassic: {file: 'Auc-ScanData.lua', name: 'Auctioneer classic'},
    Auctioneer: {file: 'Auctioneer_Stats_OverTime.lua', name: 'Auctioneer retail'},
    TSM: {file: 'TradeSkillMaster.lua', name: 'TSM'}
  };

  /**
   * A list of wow expansions
   *
   * @static
   * @memberof GameBuild
   */
  static expansionMap = [
    'Classic',
    'Burning crusade',
    'Wrath of the Lich king',
    'Cataclysm',
    'Mists of Pandaria',
    'Warlords of Draenor',
    'Legion',
    'Battle for Azeroth',
    'Shadowlands'
  ];

  static expansionMaxLevel = [
    60,
    70,
    80,
    85,
    90,
    100,
    110,
    120
  ];
  static territories = ['Alliance', 'Horde', 'Contested', 'Word PvP', 'Sanctuary', 'PvP'];

  static zoneType = ['Zone', 'City', 'Dungeon', 'Raid', 'Scenario', 'Artifact Acquisition', 'Battleground'];
}
