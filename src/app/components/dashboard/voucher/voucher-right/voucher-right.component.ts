import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';

@Component({
  selector: 'app-voucher-right',
  templateUrl: './voucher-right.component.html',
  styleUrls: ['./voucher-right.component.scss']
})
export class VoucherRightComponent implements OnInit, OnDestroy {

  // Form Properties
  form: FormGroup;

  // HTML controller
  restaurantList: any;

  constructor(
    public voucherFormService: VoucherFormService,
    public authentitcationService: AuthenticationService) { }

  ngOnInit() {
    this.restaurantList = this.authentitcationService.currentUserValue.restaurantList;
    this.setUpForm();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.voucherFormService.currentVoucherForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

}
