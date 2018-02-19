import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { Recipe } from '../models/crafting/recipe';
import { Endpoints } from './endpoints';
import { ItemService } from './item.service';

@Injectable()
export class CraftingService {

  constructor(private _http: HttpClient, private _itemService: ItemService) { }

  getRecipe(spellID: number): void {
    this.updateRecipe(spellID)
      .then(r => {
        this.handleRecipe(r);
        console.log('Added missing recipe', `${r.spellID} - ${r.name}`);
      });
  }

  getRecipes(): Promise<any> {
    console.log('Downloading recipes');
    SharedService.downloading.recipes = true;
    return this._http.get(`${Endpoints.WAH_API}GetRecipe.php`) // assets/mock/recipes.json
      .toPromise()
      .then(recipes => {
        SharedService.downloading.recipes = false;
        SharedService.recipes = recipes['recipes'];
        console.log('Recipe download is completed');

        // Adding items if there are any missing
        SharedService.recipes.forEach(r => {
          this.handleRecipe(r);
        });
      })
      .catch(e => {
        SharedService.downloading.recipes = false;
        console.error('Recipe download failed', e);
      });
  }

  updateRecipe(spellID: number): Promise<Recipe> {
    return this._http.patch(`${Endpoints.WAH_LOCAL_API}recipe/${spellID}`, null)
      .toPromise() as Promise<Recipe>;
  }

  private handleRecipe(r: Recipe): void {
    if (r.itemID > 0 && !SharedService.items[r.itemID]) {
      this._itemService.addItem(r.itemID);
    }
    r.reagents.forEach(reagent => {
      if (reagent.itemID > 0 && !SharedService.items[reagent.itemID]) {
        this._itemService.addItem(reagent.itemID);
      }
    });
    SharedService.recipesMap[r.spellID] = r;
  }
}
