import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SharedService} from '../../../../services/shared.service';
import {CraftingUtil} from '../../../crafting/utils/crafting.util';
import {UserUtil} from '../../../../utils/user/user.util';
import {AuctionsService} from '../../../../services/auctions.service';

@Component({
  selector: 'wah-crafting-settings',
  templateUrl: './crafting-settings.component.html',
  styleUrls: ['./crafting-settings.component.scss']
})
export class CraftingSettingsComponent {
  buyoutController: FormControl = new FormControl();
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private auctionService: AuctionsService) {
    this.form = this.formBuilder.group({
      buyoutLimit: new FormControl(
        SharedService.user.buyoutLimit),
      useVendorPriceForCraftingIfAvailable: new FormControl(
        SharedService.user.useVendorPriceForCraftingIfAvailable)
    });
    this.form.valueChanges
      .subscribe((data) => {
        Object.keys(data).forEach(key =>
          SharedService.user[key] = data[key]);
        UserUtil.save();
        CraftingUtil.calculateCost(false, this.auctionService.mapped.value);
      });
  }
}
