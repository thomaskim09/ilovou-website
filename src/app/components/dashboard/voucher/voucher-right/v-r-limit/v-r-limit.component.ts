import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { min, max } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-limit',
  templateUrl: './v-r-limit.component.html',
  styleUrls: ['./v-r-limit.component.scss']
})
export class VRLimitComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup;

  // Validation
  validation_messages: any;

  // Min Max date controller
  minLT: Date;
  maxLT: Date;
  minSS: Date;
  maxSS: Date;

  constructor(
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.limitValidationMessage();
    this.setUpControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpControl() {
    this.form.get('limitedQuantity').disable();
    this.form.get('limitedQuantityPerUser').disable();
    this.form.get('limitedEndTime').disable();
    this.form.get('startSellingTime').disable();
  }

  private onChanges() {
    this.form.get('limitedQuantityModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('limitedQuantity').enable();
        this.form.get('groupVoucherModel').disable({ emitEvent: false });
      } else {
        this.form.get('limitedQuantity').disable();
        if (!this.form.get('limitedQuantityPerUserModel').value) {
          this.form.get('groupVoucherModel').enable({ emitEvent: false });
        }
      }
    });

    this.form.get('limitedQuantityPerUserModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('limitedQuantityPerUser').enable();
        this.form.get('groupVoucherModel').disable({ emitEvent: false });
      } else {
        this.form.get('limitedQuantityPerUser').disable();
        if (!this.form.get('limitedQuantityModel').value) {
          this.form.get('groupVoucherModel').enable({ emitEvent: false });
        }
      }
    });

    this.form.get('limitedEndTimeModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('limitedEndTime').enable();
      } else {
        this.form.get('limitedEndTime').disable();
      }
    });

    this.form.get('startSellingTimeModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('startSellingTime').enable();
      } else {
        this.form.get('startSellingTime').disable();
      }
    });
  }

  setDate(type) {
    const fv = this.form.value;
    const today = new Date();
    const VF = type === 'vF' ? undefined : fv.validFrom;
    const VU = type === 'vU' ? undefined : fv.validUntil;
    const LT = type === 'LT' ? undefined : fv.limitedEndTime;
    const SS = type === 'SS' ? undefined : fv.startSellingTime;
    const list = [VF, SS, LT].filter(Boolean);
    this[`min${type}`] = this.getMin(type, list, VF, today);
    this[`max${type}`] = type === 'SS' ? min([VU, LT]) : VU;
  }

  private getMin(type, list, VF, today) {
    if (type === 'LT') {
      return max([...list, today]);
    } else if (type === 'SS') {
      delete list[1];
      return max([VF, today]);
    } else {
      return max(list);
    }
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
