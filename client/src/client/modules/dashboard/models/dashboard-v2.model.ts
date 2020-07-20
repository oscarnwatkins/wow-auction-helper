import {DefaultDashboardSettings} from './default-dashboard-settings.model';
import {ItemRule, Rule} from './rule.model';
import {ColumnDescription} from '../../table/models/column-description';

export interface DashboardV2 {
  id: string; // UUID type id?
  idParam: string; // The name of the id param for the table
  title: string;
  tsmShoppingString?: string;
  columns: ColumnDescription[];
  data: any[];
  message?: string;

  isCrafting?: boolean;
  isDisabled?: boolean;
  onlyItemsWithRules?: boolean;
  settings?: DefaultDashboardSettings;
  rules: Rule[];
  itemRules?: ItemRule[];

  createdBy?: string;
  createdById?: string;
  lastModified?: number;
}
