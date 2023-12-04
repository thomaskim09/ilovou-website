import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-set-details',
  templateUrl: './v-r-set-details.component.html',
  styleUrls: ['./v-r-set-details.component.scss']
})
export class VRSetDetailsComponent implements OnInit, OnChanges {

  @Input('form') form: FormGroup;

  // To avoid production error
  setDetailsControls: any;

  // Validation
  validation_messages: any;

  constructor(
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.setDetailsValidationMessage();
  }

  ngOnChanges() {
    if (this.form) {
      this.setDetailsControls = this.form.get('setDetails');
    }
  }

  addSetDetails() {
    this.voucherFormService.addSetDetails();
  }

  deleteSetDetails(i) {
    this.voucherFormService.deleteSetDetails(i);
  }

  addSetContent(i) {
    this.voucherFormService.addSetContentDetails(i);
  }

  deleteSetContent(i, j) {
    this.voucherFormService.deleteSetContentDetails(i, j);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
