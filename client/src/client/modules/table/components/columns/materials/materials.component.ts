import {Component, Input, OnInit} from '@angular/core';
import {Reagent} from '../../../../crafting/models/reagent';
import {SharedService} from '../../../../../services/shared.service';
import {CraftingUtil} from '../../../../crafting/utils/crafting.util';
import {Recipe} from '../../../../crafting/models/recipe';
import {ItemService} from '../../../../../services/item.service';
import {CustomProcUtil} from '../../../../crafting/utils/custom-proc.util';
import {NumberUtil} from '../../../../util/utils/number.util';
import {NpcService} from '../../../../npc/services/npc.service';
import {ItemNpcDetails} from '../../../../item/models/item-npc-details.model';
import {AuctionsService} from '../../../../../services/auctions.service';
import {CraftingService} from '../../../../../services/crafting.service';

@Component({
  selector: 'wah-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() recipeId: number;

  constructor(private auctionService: AuctionsService) {
  }

  ngOnInit() {
    if (this.recipeId) {
      this.recipe = CraftingService.map.value.get(this.recipeId);
    }
  }

  getItemValue(itemID: number) {
    return CraftingUtil.getCost(itemID, 1);
  }

  getItemName(itemID): string {
    return SharedService.items[itemID] ? SharedService.items[itemID].name : '';
  }

  isEnoughAtAH(itemID: number, count): boolean {
    if (this.getAtAHCount(itemID) >= count) {
      return true;
    }
    return false;
  }

  useIntermediateCrafting(): boolean {
    return SharedService.user && SharedService.user.useIntermediateCrafting;
  }

  getAtAHCount(itemID: number): number {
    return this.auctionService.mapped.value.get('' + itemID) ?
      this.auctionService.mapped.value.get('' + itemID).quantityTotal : 0;
  }

  setSelectedItem(reagent: Reagent): void {
    SharedService.events.detailSelection.emit(SharedService.items[reagent.id]);
    ItemService.itemSelection.emit(reagent.id);
  }

  getMinCount(recipe: Recipe): number {
    return CustomProcUtil.get(recipe);
  }

  vendorTooltip(reagent: Reagent): string {
    if (this.usingVendor) {
      const item: ItemNpcDetails = NpcService.itemNpcMap.value.get(reagent.id);
      if (!this.vendorHasEnough(reagent) && item) {
        const vendorCount = item.vendorAvailable;
        return `You need to buy ${reagent.quantity - vendorCount} from AH and ${
          vendorCount} from the vendor. This is used for cost calculation.`;
      }
      return `This item is sold by a vendor, and it is currently cheaper source than from the AH.`;
    }
    return '';
  }

  usingVendor(reagent: Reagent): boolean {
    return CraftingUtil.isVendorCheaperThanAH(reagent.id);
  }

  getReagentFromVendorString(reagent: Reagent): string | boolean {
    return this.usingVendor(reagent) ? '(V)' : '';
  }

  vendorHasEnough(reagent: Reagent) {
    return SharedService.items[reagent.id] &&
      SharedService.items[reagent.id].vendorBoughtLimit >= reagent.quantity;
  }

  getAhCountTooltip(id: number) {
    return `There are currently ${
      NumberUtil.format(this.getAtAHCount(id)) } at the auction house.`;
  }
}
