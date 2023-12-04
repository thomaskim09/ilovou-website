import lo_orderBy from 'lodash/orderBy';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { VoucherService } from 'src/app/providers/voucher/voucher.service';

interface Rule {
  name: string;
}

@Component({
  selector: 'app-v-r-rules',
  templateUrl: './v-r-rules.component.html',
  styleUrls: ['./v-r-rules.component.scss']
})
export class VRRulesComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup;

  // Branch properties
  currentUser: any;
  branchList: any;
  previousBranchRules: string;

  // voucher rules select
  ruleFilterCtrl: FormControl = new FormControl();
  ruleOptions: Rule[] = [];
  filteredRule: ReplaySubject<Rule[]> = new ReplaySubject<Rule[]>(1);

  constructor(
    public authenticationService: AuthenticationService,
    public voucherService: VoucherService,
    public hintService: HintService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.setUpBranchList();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left of untilDestroyed
  }

  private setUpBranchList() {
    if (this.currentUser.restaurantList.length > 1) {
      this.voucherService.getBranchList(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
        this.branchList = val;
      });
    }
  }

  private onChanges() {
    this.form.get('voucherType').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.form.get('ruleDetails').enable();
      this.form.get('customRuleInput').enable();
      switch (val) {
        case 'SV': this.ruleOptions = this.setUpSetRules(); break;
        case 'CV': this.ruleOptions = this.setUpCashRules(); break;
        case 'QV': this.ruleOptions = this.setUpQuantityRules(); break;
        case 'MV': this.ruleOptions = this.setUpMonthlyRules(); break;
      }
      this.setUpRules();
      this.form.get('ruleDetails').setValue(undefined);
    });

    if (this.currentUser.restaurantList.length > 1) {
      this.form.get('restaurantList').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        if (!val) {
          return;
        }
        if (this.previousBranchRules) {
          this.removeCustomRule(this.previousBranchRules);
        }
        // Setting new branch rule
        let branchRule = `This voucher can be used on `;
        branchRule += `${this.currentUser.restaurantName}, `;
        this.branchList.map(val2 => {
          if (val.includes(val2._id)) {
            branchRule += `${val2.name}, `;
          }
        });
        branchRule = branchRule.slice(0, -2);
        branchRule += '.';
        const array = this.form.get('customRuleDetails').value || [];
        array.push(branchRule);
        this.form.get('customRuleDetails').setValue(array);
        // Keep for new branch rule
        this.previousBranchRules = branchRule;
      });
    }
  }

  removeCustomRule(item) {
    const array = this.form.get('customRuleDetails').value;
    const result = array.filter(val => val !== item);
    this.form.get('customRuleDetails').setValue(result);
  }

  removeRule(item) {
    const array = this.form.get('ruleDetails').value;
    const result = array.filter(val => val !== item);
    this.form.get('ruleDetails').setValue(result);
  }

  customRuleChange() {
    const value = this.form.get('customRuleInput').value;
    const array = this.form.get('customRuleDetails').value || [];
    array.push(value);
    this.form.get('customRuleDetails').setValue(array);
    this.form.get('customRuleInput').reset();
  }

  checkRulesLength() {
    const fv = this.form.value;
    if (fv.customRuleDetails || fv.ruleDetails) {
      const custom = fv.customRuleDetails || [];
      const rule = fv.ruleDetails || [];
      return (custom.length + rule.length > 6) ? true : false;
    } else {
      return false;
    }
  }

  checkRulesEmpty() {
    const fv = this.form.value;
    if (fv.customRuleDetails || fv.ruleDetails) {
      const custom = fv.customRuleDetails || [];
      const rule = fv.ruleDetails || [];
      return (custom.length + rule.length === 0) ? true : false;
    } else {
      return false;
    }
  }

  private setUpRules() {
    this.filteredRule.next(this.ruleOptions.slice());
    this.ruleFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredRule.next(this.filterTag(this.ruleOptions, this.ruleFilterCtrl));
    });
  }

  private filterTag(options, formControl) {
    if (!options) {
      return;
    }
    // get the search keyword
    let search = formControl.value;
    if (!search) {
      return options.slice();
    } else {
      search = search.toLowerCase();
    }
    // filter the tags
    return options.filter(tag => tag.name.toLowerCase().indexOf(search) > -1);
  }

  private setUpCommonRules() {
    return [
      { name: `Limited to 1 voucher per receipt.` },
      { name: `The restaurant reserves the right to change the right to change the terms and conditions at any time` },
      { name: `No reservation needed, but might need to wait during peak hours. ` },
      { name: `Not valid with any other ongoing promotions` },
      { name: `Recommend for one person` },
      { name: `Voucher can be combined` },
      { name: `Valid in all branches` },
      { name: `Valid on public holidays` },
      { name: `Not valid on public holidays` },
      { name: `Valid for dine-in and takeaways` },
      { name: `Food wastage is subject to surcharge of RM10 per 100g` },
    ];
  }

  private setUpSetRules() {
    const rules = [
      { name: `If part of dishes can't be provided, restaurant will replace it with other same value dishes.` },
    ];
    return this.combineSortRules(rules);
  }

  private setUpQuantityRules() {
    const rules = [

    ];
    return this.combineSortRules(rules);
  }

  private setUpMonthlyRules() {
    const rules = [
      { name: `At least need to order a drink` },
      { name: `At least need to order a main dish` },
    ];
    return this.combineSortRules(rules);
  }

  private setUpCashRules() {
    const rules = [
      { name: `No change is given if purchase value is less than the value of this voucher.` },
      { name: `Any purchases in excess of the voucher value must be settled directly with the merchant, subject to applicable taxes and charges.` },
      { name: `No splitting of bills.` },
      { name: `Strictly valid for dine-in only.` },
      { name: `Voucher may not be used for set menu items, promotional or discounted items.` },
      { name: `No minimum spend required.` },
      { name: `Strictly no extension is allowed for expired e-voucher.` },
      { name: `Voucher is non-refundable, non-transferable, and non-exchangeable for cash or any other items.` },
    ];
    return this.combineSortRules(rules);
  }

  private combineSortRules(rules) {
    const common = this.setUpCommonRules();
    let result = common.concat(rules);
    result = lo_orderBy(result, [val => val.name.toLowerCase()], ['asc']);
    return result;
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
