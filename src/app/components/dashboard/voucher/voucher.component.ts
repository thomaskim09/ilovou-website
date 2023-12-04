import { Component, OnInit, OnDestroy } from '@angular/core';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { FormGroup } from '@angular/forms';
import { VoucherViewService } from 'src/app/providers/voucher/voucherView/voucher-view.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import lo_isEmpty from 'lodash/isEmpty';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit, OnDestroy {

  // Form Properties
  form: FormGroup;

  needVoucherRight: boolean = false;

  // Voucher view properties
  voucherSelected: string;

  constructor(
    public voucherFormService: VoucherFormService,
    public voucherViewService: VoucherViewService) { }

  ngOnInit() {
    this.setUpForm();
    this.listenToViewVoucher();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.voucherFormService.currentVoucherForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private listenToViewVoucher() {
    this.voucherViewService.currentMessage.pipe(untilDestroyed(this)).subscribe(id => {
      if (lo_isEmpty(id)) {
        return;
      }
      if (id === 'new') {
        this.form.reset('', { emitEvent: false, onlySelf: true });
        this.form.get('groupVoucherModel').enable();
        this.form.get('limitedQuantityModel').enable();
        this.form.get('limitedQuantityPerUserModel').enable();
        this.form.get('limitedQuantityModel').setValue(false);
        this.form.get('limitedQuantityPerUserModel').setValue(false);
        this.form.get('limitedEndTimeModel').setValue(false);
        this.form.get('startSellingTimeModel').setValue(false);
        this.voucherFormService.resetSetDetails();
        this.voucherFormService.resetQuantityDetails();
        this.voucherFormService.resetMonthlyDetails();
        this.voucherFormService.resetGroupDetails();
        this.needVoucherRight = true;
      } else if (id === 'full') {
        this.needVoucherRight = false;
      } else {
        this.needVoucherRight = true;
      }
      this.voucherSelected = id;
    });
  }
}
