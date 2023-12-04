import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-quantity-details',
  templateUrl: './v-r-quantity-details.component.html',
  styleUrls: ['./v-r-quantity-details.component.scss']
})
export class VRQuantityDetailsComponent implements OnInit, OnChanges {

  @Input('form') form: FormGroup;

  // For production error
  quantityDetailsControls: any;

  // Validation
  validation_messages: any;

  constructor(
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.quantityDetailsValidationMessage();
  }

  ngOnChanges() {
    if (this.form) {
      this.quantityDetailsControls = this.form.get('quantityDetails');
    }
  }

  addQuantityDetails() {
    this.voucherFormService.addQuantityDetails();
  }

  deleteQuantityDetails(i) {
    this.voucherFormService.deleteQuantityDetails(i);
  }

  addQuantityContent(i) {
    this.voucherFormService.addQuantityContentDetails(i);
  }

  deleteQuantityContent(i, j) {
    this.voucherFormService.deleteQuantityContentDetails(i, j);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
