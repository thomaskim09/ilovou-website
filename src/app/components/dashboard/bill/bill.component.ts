import { BillFormService } from 'src/app/providers/bill/bill-form/bill-form.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import lo_isEmpty from 'lodash/isEmpty';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit, OnDestroy {

  // Form Properties
  form: FormGroup;

  // Controller
  needVoucherRight: boolean = false;
  needHint: boolean = true;

  constructor(
    public billFormService: BillFormService,
    public dataService: DataService) { }

  ngOnInit() {
    this.setUpForm();
    this.listenToBill();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.billFormService.currentBillForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private listenToBill() {
    this.dataService.currentBill.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      this.needVoucherRight = val.needVoucherRight;
      this.needHint = val.needHint;
    });
  }
}
