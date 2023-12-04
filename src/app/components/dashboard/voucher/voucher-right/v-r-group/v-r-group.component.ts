import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-group',
  templateUrl: './v-r-group.component.html',
  styleUrls: ['./v-r-group.component.scss']
})
export class VRGroupComponent implements OnInit, OnDestroy, OnChanges {

  @Input('form') form: FormGroup;

  // For production error
  groupVoucherDetailsControls: any;

  // Validation
  validation_messages: any;

  constructor(
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.groupVoucherValidationMessage();
    this.setUpControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  ngOnChanges() {
    if (this.form) {
      this.groupVoucherDetailsControls = this.form.get('groupVoucherDetails');
    }
  }

  private setUpControl() {
    this.form.get('groupVoucherDetails').disable();
  }

  private onChanges() {
    this.form.get('groupVoucherModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('groupVoucherDetails').enable();
        this.form.get('limitedQuantityModel').disable({ emitEvent: false });
        this.form.get('limitedQuantityPerUserModel').disable({ emitEvent: false });
      } else {
        this.form.get('groupVoucherDetails').disable();
        this.form.get('limitedQuantityModel').enable({ emitEvent: false });
        this.form.get('limitedQuantityPerUserModel').enable({ emitEvent: false });
      }
    });
  }

  addGroupVoucherDetails() {
    this.voucherFormService.addGroupVoucherDetails();
  }

  deleteGroupVoucherDetails(i) {
    this.voucherFormService.deleteGroupVoucherDetails(i);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
