import lo_isEmpty from 'lodash/isEmpty';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoucherService } from 'src/app/providers/voucher/voucher.service';
import { VoucherViewService } from 'src/app/providers/voucher/voucherView/voucher-view.service';
import { format, parseISO, parse } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';

@Component({
  selector: 'app-voucher-right-view',
  templateUrl: './voucher-right-view.component.html',
  styleUrls: ['./voucher-right-view.component.scss']
})
export class VoucherRightViewComponent implements OnInit, OnDestroy {

  branchList: any;
  voucher: any;

  // Controller
  needSpinner: boolean = false;

  constructor(
    public voucherViewService: VoucherViewService,
    public voucherService: VoucherService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.setUpBranchList();
    this.listenToVoucherView();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpBranchList() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.restaurantList.length > 1) {
      this.voucherService.getBranchList(currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
        this.branchList = val;
      });
    }
  }

  private listenToVoucherView() {
    this.voucherViewService.currentMessage.pipe(untilDestroyed(this)).subscribe(id => {
      if (lo_isEmpty(id)) {
        return;
      }
      if (id === 'new' || id === 'full') {
        return;
      }
      this.setUpVoucherDetails(id);
    });
  }

  private setUpVoucherDetails(voucherId) {
    this.needSpinner = true;
    this.voucherService.getVoucher(voucherId).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      const vl = val.details;
      this.voucher = {
        voucherType: this.getVoucherType(vl.voucherType),
        voucherName: vl.voucherName,
        voucherImage: vl.voucherImage,
        newPrice: vl.newPrice,
        basePrice: vl.basePrice,
        validFrom: this.formatDate(vl.voucherRules.validFrom),
        validUntil: this.formatDate(vl.voucherRules.validUntil),
        startTime: this.formatTime(vl.voucherRules.startTime),
        endTime: this.formatTime(vl.voucherRules.endTime),
        ruleDetails: vl.voucherRules.ruleDetails,
        customRuleDetails: vl.voucherRules.customRuleDetails,
        restaurantList: this.getBranchName(val.restaurantList),
        // Group details
        groupVoucherDetails: vl.groupVoucherDetails,
        // Set voucher
        suitablePax: vl.suitablePax,
        setDetails: vl.setDetails,
        // Quantity voucher
        quantityUnit: vl.quantityUnit,
        quantityDetails: vl.quantityDetails,
        // Cash Voucher
        minimumSpend: vl.minimumSpend,
        // Monthly voucher
        limitPerDay: vl.limitPerDay,
        monthlyDetails: vl.monthlyDetails,
        // Limit control
        limitedQuantity: vl.limitedQuantity,
        limitedQuantityPerUser: vl.limitedQuantityPerUser,
        limitedEndTime: this.formatDateTime(vl.limitedEndTime),
        startSellingTime: this.formatDateTime(vl.startSellingTime)
      };
    });
  }

  private getVoucherType(type) {
    switch (type) {
      case 'SV': return 'Set Voucher';
      case 'QV': return 'Quantity Voucher';
      case 'CV': return 'Cash Voucher';
      case 'MV': return 'Monthly Voucher';
    }
  }

  private getBranchName(restaurantList) {
    const final = [];
    this.branchList.map(val2 => {
      if (restaurantList.includes(val2._id)) {
        final.push(val2.name);
      }
    });
    return final;
  }

  private formatDate(date) {
    return date ? format(parseISO(date), 'dd-MM-yyyy') : undefined;
  }

  private formatTime(date) {
    return date ? format(parse(date, 'HH:mm', new Date()), 'hh:mm a') : undefined;
  }

  private formatDateTime(date) {
    return date ? format(parseISO(date), 'dd-MM-yyyy (hh:mm a)') : undefined;
  }

}
