import { CommonService } from 'src/app/providers/common/common.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ImageCropModalComponent } from '../../../modals/image-crop-modal/image-crop-modal.component';
import { MatDialog } from '@angular/material';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { max } from 'date-fns';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-v-r-main-content',
  templateUrl: './v-r-main-content.component.html',
  styleUrls: ['./v-r-main-content.component.scss']
})
export class VRMainContentComponent implements OnInit, OnDestroy {

  @Input('form') form: FormGroup;

  voucherTypeList = [
    { name: 'Set Voucher', value: 'SV' },
    { name: 'Quantity Voucher', value: 'QV' },
    { name: 'Cash Voucher', value: 'CV' },
    { name: 'Monthly Voucher', value: 'MV' },
  ];

  // Validation
  validation_messages: any;

  // Date
  minVF: Date;
  maxVF: Date;
  minVU: Date;
  maxVU: Date;

  constructor(
    public dialog: MatDialog,
    public voucherFormService: VoucherFormService,
    public hintService: HintService,
    public commonService: CommonService,
    private atp: AmazingTimePickerService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.voucherFormService.mainContentValidationMessage();
    this.setUpControl();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left of untilDestroyed
  }

  private setUpControl() {
    this.form.get('setDetails').disable();
    this.form.get('quantityDetails').disable();
    this.form.get('monthlyDetails').disable();
  }

  private onChanges() {
    this.form.get('voucherType').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.handlePrefix();
      switch (val) {
        case 'SV': {
          // Set Voucher
          this.form.get('suitablePax').enable();
          this.form.get('setDetails').enable();
          // Quantity Voucher
          this.form.get('quantityUnit').disable();
          this.form.get('quantityDetails').disable();
          // Cash Voucher
          this.form.get('minimumSpend').disable();
          // Monthly Voucher
          this.form.get('limitPerDay').disable();
          this.form.get('monthlyDetails').disable();
          // Group Voucher
          this.form.get('groupVoucherDetails').enable();
          this.hintSender(3);
          break;
        }
        case 'QV': {
          // Set Voucher
          this.form.get('suitablePax').disable();
          this.form.get('setDetails').disable();
          // Quantity Voucher
          this.form.get('quantityUnit').enable();
          this.form.get('quantityDetails').enable();
          // Cash Voucher
          this.form.get('minimumSpend').disable();
          // Monthly Voucher
          this.form.get('limitPerDay').disable();
          this.form.get('monthlyDetails').disable();
          // Group Voucher
          this.form.get('groupVoucherDetails').enable();
          this.hintSender(4);
          break;
        }
        case 'CV': {
          // Set Voucher
          this.form.get('suitablePax').disable();
          this.form.get('setDetails').disable();
          // Quantity Voucher
          this.form.get('quantityUnit').disable();
          this.form.get('quantityDetails').disable();
          // Cash Voucher
          this.form.get('minimumSpend').enable();
          // Monthly Voucher
          this.form.get('limitPerDay').disable();
          this.form.get('monthlyDetails').disable();
          // Group Voucher
          this.form.get('groupVoucherDetails').disable();
          this.hintSender(5);
          break;
        }
        case 'MV': {
          // Set Voucher
          this.form.get('suitablePax').disable();
          this.form.get('setDetails').disable();
          // Quantity Voucher
          this.form.get('quantityUnit').disable();
          this.form.get('quantityDetails').disable();
          // Cash Voucher
          this.form.get('minimumSpend').disable();
          // Monthly Voucher
          this.form.get('limitPerDay').enable();
          this.form.get('monthlyDetails').enable();
          // Group Voucher
          this.form.get('groupVoucherDetails').disable();
          this.hintSender(38);
          break;
        }
      }

    });
    this.form.get('suitablePax').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.handlePrefix();
    });
    this.form.get('quantityUnit').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.handlePrefix();
    });
  }

  private handlePrefix() {
    const fv = this.form.value;
    switch (fv.voucherType) {
      case 'SV': {
        this.form.get('prefix').setValue(fv.suitablePax ? `${fv.suitablePax} Person ` : '? Person ');
        this.form.get('suffix').setValue('');
        break;
      }
      case 'QV': {
        this.form.get('prefix').setValue(fv.quantityUnit ? `${fv.quantityUnit} x ` : '? x ');
        this.form.get('suffix').setValue('');
        break;
      }
      case 'CV': {
        this.form.get('prefix').setValue(`RM`);
        this.form.get('suffix').setValue('Cash Voucher');
        break;
      }
      case 'MV': {
        this.form.get('prefix').setValue(`Monthly `);
        this.form.get('suffix').setValue('');
        break;
      }
    }
  }

  showImageCropModal() {
    const dialogRef = this.dialog.open(ImageCropModalComponent, { width: '25%', });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.commonService.compressImage(val, this.form.get('voucherImage'));
      }
    });
  }

  setDate(type) {
    const fv = this.form.value;
    const VF = type === 'VF' ? undefined : fv.validFrom;
    const VU = type === 'VU' ? undefined : fv.validUntil;
    const LT = type === 'LT' ? undefined : fv.limitedEndTime;
    const SS = type === 'SS' ? undefined : fv.startSellingTime;
    const list = [VF, SS, LT].filter(Boolean);
    this[`min${type}`] = max(list);
    this[`max${type}`] = VU;
  }

  openAtp(type) {
    const amazingTimePicker = this.atp.open({
      arrowStyle: { background: '#ff9566', color: 'white' }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      this.form.get(type).setValue(time);
    });
  }

  imageHintMessage() {
    const value = this.form.get('voucherType').value;
    switch (value) {
      case 'SV': this.hintSender(8); break;
      case 'QV': this.hintSender(9); break;
      case 'CV': this.hintSender(10); break;
      case 'MV': this.hintSender(40); break;
    }
  }

  voucherNameHintMessage() {
    const value = this.form.get('voucherType').value;
    switch (value) {
      case 'SV': this.hintSender(11); break;
      case 'QV': this.hintSender(12); break;
      case 'CV': this.hintSender(13); break;
      case 'MV': this.hintSender(41); break;
    }
  }

  priceHintMessage() {
    const value = this.form.get('voucherType').value;
    switch (value) {
      case 'SV': this.hintSender(14); break;
      case 'QV': this.hintSender(15); break;
      case 'CV': this.hintSender(16); break;
      case 'MV': this.hintSender(42); break;
    }
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
