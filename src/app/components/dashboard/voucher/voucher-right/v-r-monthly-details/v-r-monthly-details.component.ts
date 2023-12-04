import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { CommonFormService } from '../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-monthly-details',
  templateUrl: './v-r-monthly-details.component.html',
  styleUrls: ['./v-r-monthly-details.component.scss']
})
export class VRMonthlyDetailsComponent implements OnInit, OnChanges {

  @Input('form') form: FormGroup;

  // To avoid production error
  monthlyDetailsControls: any;

  // Validation
  validation_messages: any;

  constructor(
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.monthlyDetailsValidationMessage();
  }

  ngOnChanges() {
    if (this.form) {
      this.monthlyDetailsControls = this.form.get('monthlyDetails');
    }
  }

  addMonthlyDetails() {
    this.voucherFormService.addMonthlyDetails();
  }

  deleteMonthlyDetails(i) {
    this.voucherFormService.deleteMonthlyDetails(i);
  }

  addMonthlyContent(i) {
    this.voucherFormService.addMonthlyContentDetails(i);
  }

  deleteMonthlyContent(i, j) {
    this.voucherFormService.deleteMonthlyContentDetails(i, j);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
