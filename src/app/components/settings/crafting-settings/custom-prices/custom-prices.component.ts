import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { SharedService } from '../../../../services/shared.service';
import { Item } from '../../../../models/item/item';
import { CustomPrice, CustomPrices } from '../../../../models/crafting/custom-price';
import { ColumnDescription } from '../../../../models/column-description';
import { Crafting } from '../../../../models/crafting/crafting';

@Component({
  selector: 'wah-custom-prices',
  templateUrl: './custom-prices.component.html',
  styleUrls: ['./custom-prices.component.scss']
})
export class CustomPricesComponent implements OnInit, OnDestroy {

  itemSearchForm: FormControl = new FormControl();
  filteredItems: Observable<any>;
  columns: Array<ColumnDescription> = new Array<ColumnDescription>();
  saveInterval: any;

  constructor(private _formBuilder: FormBuilder) {
    this.filteredItems = this.itemSearchForm.valueChanges
      .pipe(
        startWith(''),
        map(name => this.filter(name))
      );
    this.columns.push({ key: 'name', title: 'Name', dataType: 'name' });
    this.columns.push({ key: 'price', title: 'Price', dataType: 'gold' });
    this.columns.push({ key: 'price', title: 'Price in copper', dataType: 'input-number' });
    this.columns.push({ key: '', title: 'Actions', dataType: 'actions', actions: ['custom-price-save'] });
  }

  ngOnInit(): void {
    this.saveInterval = setInterval(() => {
      if (JSON.stringify(SharedService.user.customPrices) !== localStorage['custom_prices']) {
        console.log('Saving change to custom price and recalculating costs');
        CustomPrices.save();
        Crafting.calculateCost();
      }
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.saveInterval);
  }

  getCustomPrices(): Array<CustomPrice> {
    return SharedService.user.customPrices;
  }

  customPrices(): CustomPrices {
    return CustomPrices;
  }

  /**
   * Such efficient, such ugh
   * @param name Item name for the query
   */
  private filter(name: string): Array<Item> {
    return SharedService.itemsUnmapped.filter( i =>
      i.name.toLowerCase().indexOf(name.toLowerCase()) !== -1).slice(0, 20);
  }

  /* istanbul ignore next */
  isDarkmode(): boolean {
    return SharedService.user ? SharedService.user.isDarkMode : false;
  }
}
