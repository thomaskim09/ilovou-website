import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup, Validators } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-m-l-setting',
  templateUrl: './m-l-setting.component.html',
  styleUrls: ['./m-l-setting.component.scss']
})
export class MLSettingComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  currentUser: any;
  restaurantId: string;
  menuId: string;

  // Validation
  validation_messages: any;

  isFormChanged: boolean;

  // Controller
  timer: any;
  needSpinner: boolean = false;

  orderModeType = [
    { name: 'Only dine-in orders', value: 'onlyDineIn' },
    { name: 'Only take-away orders', value: 'onlyTakeAway' },
    { name: 'Both dine-in and take-away orders', value: 'all' },
  ];

  displayModeType = [
    { name: `Item's full name`, value: 'fullName' },
    { name: `Item's short name`, value: 'shortName' },
    { name: `Item's code`, value: 'itemCode' },
  ];

  constructor(
    public menuFormService: MenuFormService,
    public menuService: MenuService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public hintService: HintService,
    public dataService: DataService,
    public commonService: CommonService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.menuFormService.mLSettingValidationMessage();
    this.currentUser = this.authenticationService.currentUserValue;
    this.restaurantId = this.currentUser.restaurantId;
    this.setUpForm();
    this.setUpMenuSettings();
    this.onChanges();
    this.listenToFormChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpForm() {
    this.menuFormService.currentMenuSettingForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private setUpMenuSettings() {
    if (this.currentUser.menuId) {
      this.menuId = this.currentUser.menuId;
      this.menuService.getMenuSettings(this.menuId).pipe(untilDestroyed(this)).subscribe(val => {
        const ms = val.menuSettings;
        const sd = ms.securityDetails || {};
        const md = ms.modeDetails || {};
        const cd = ms.commonDetails || {};
        const td = ms.totalDetails || {};
        const nd = ms.noticeDetails || {};
        this.form.patchValue({
          hasMenu: ms.hasMenu,
          hasTableNoLock: sd.hasTableNoLock,
          hasTableNoRange: sd.hasTableNoRange,
          tableNoRange: sd.tableNoRange,
          orderMode: md.orderMode,
          displayMode: md.displayMode,
          hasTranslation: cd.hasTranslation,
          hasCallService: cd.hasCallService,
          hasPayCounter: cd.hasPayCounter,
          hasNotifyService: cd.hasNotifyService,
          hasHideTotal: cd.hasHideTotal,
          hasTax: td.hasTax,
          taxPercentage: td.taxPercentage,
          hasServiceCharge: td.hasServiceCharge,
          serviceChargePercentage: td.serviceChargePercentage,
          hasTakeAway: td.hasTakeAway,
          hasTakeAwayFee: td.hasTakeAwayFee,
          hasTakeAwayPerPackage: td.hasTakeAwayPerPackage,
          takeAwayFee: td.takeAwayFee,
          hasNotice: nd.hasNotice,
          noticeTitle: nd.noticeTitle,
          noticeTitleTranslated: nd.noticeTitleTranslated,
          noticeContent: nd.noticeContent,
          noticeContentTranslated: nd.noticeContentTranslated
        });
      });
    } else {
      this.form.reset();
    }
  }

  private onChanges() {
    // Cleaner code
    const fc = this.form.controls;

    this.form.get('hasMenu').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.orderMode.enable();
        fc.hasTableNoLock.enable();
        fc.hasTableNoRange.enable();
        fc.hasTranslation.enable();
        fc.hasCallService.enable();
        fc.hasPayCounter.enable();
        fc.hasNotifyService.enable();
        fc.hasHideTotal.enable();
        fc.displayMode.enable();
        fc.hasTax.enable();
        fc.hasServiceCharge.enable();
        fc.hasTakeAway.enable();
        fc.hasTakeAwayFee.enable();
        fc.hasNotice.enable();
        this.dataService.changeMenuCreate({
          menuId: this.menuId,
          needMenu: true
        });
      } else {
        fc.orderMode.disable();
        fc.hasTableNoLock.disable();
        fc.hasTableNoRange.disable();
        fc.hasTranslation.disable();
        fc.hasCallService.disable();
        fc.hasPayCounter.disable();
        fc.hasNotifyService.disable();
        fc.hasHideTotal.disable();
        fc.displayMode.disable();
        fc.hasTax.disable();
        fc.taxPercentage.disable();
        fc.hasServiceCharge.disable();
        fc.serviceChargePercentage.disable();
        fc.hasTakeAway.disable();
        fc.hasTakeAwayFee.disable();
        fc.hasTakeAwayPerPackage.disable();
        fc.takeAwayFee.disable();
        fc.hasNotice.disable();
        this.dataService.changeMenuCreate({
          menuId: this.menuId,
          needMenu: false
        });
      }
    });

    this.form.get('hasTableNoRange').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.tableNoRange.enable();
      } else {
        fc.tableNoRange.disable();
      }
    });

    this.form.get('orderMode').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      switch (val) {
        case 'onlyDineIn': {
          fc.hasTakeAway.clearValidators();
          fc.hasTakeAway.updateValueAndValidity();
          if (fc.hasTakeAway.value) {
            fc.hasTakeAway.setValue(false);
          }
          break;
        }
        case 'onlyTakeAway': {
          fc.hasTakeAway.setValidators([Validators.requiredTrue]);
          fc.hasTakeAway.updateValueAndValidity();
          if (!fc.hasTakeAway.value) {
            fc.hasTakeAway.setValue(true);
          }
          break;
        }
        case 'all': {
          fc.hasTakeAway.setValidators([Validators.requiredTrue]);
          fc.hasTakeAway.updateValueAndValidity();
          if (!fc.hasTakeAway.value) {
            fc.hasTakeAway.setValue(true);
          }
          break;
        }
      }
    });

    this.form.get('hasTax').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.taxPercentage.enable();
      } else {
        fc.taxPercentage.disable();
      }
    });

    this.form.get('hasServiceCharge').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.serviceChargePercentage.enable();
      } else {
        fc.serviceChargePercentage.disable();
      }
    });

    this.form.get('hasTakeAway').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.hasTakeAwayFee.enable();
      } else {
        fc.hasTakeAwayFee.disable();
        fc.hasTakeAwayPerPackage.disable();
        fc.takeAwayFee.disable();
      }
    });

    this.form.get('hasTakeAwayFee').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.hasTakeAwayPerPackage.enable();
        fc.takeAwayFee.enable();
      } else {
        fc.hasTakeAwayPerPackage.disable();
        fc.takeAwayFee.disable();
      }
    });

    this.form.get('hasNotice').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        fc.noticeTitle.enable();
        fc.noticeTitleTranslated.enable();
        fc.noticeContent.enable();
        fc.noticeContentTranslated.enable();
      } else {
        fc.noticeTitle.disable();
        fc.noticeTitleTranslated.disable();
        fc.noticeContent.disable();
        fc.noticeContentTranslated.disable();
      }
    });
  }

  private listenToFormChanges() {
    this.timer = setTimeout(() => {
      this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        this.isFormChanged = true;
      });
    }, 1500);
  }

  createMenu() {
    if (!this.form.valid) {
      this.toastError();
      return;
    }
    const title = 'Confirm to save menu setting?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      } else if (!this.restaurantId) {
        this.toastr.error('Need to create a restaurant first');
        return;
      }
      this.needSpinner = true;
      this.authenticationService.checkAdminFeature(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
        if (!val) {
          this.toastr.error('Please upgrade your package to access this feature');
          return;
        }
        const settings = this.menuFormService.settingSetter(this.form);
        this.menuService.createMenu(this.restaurantId, settings).pipe(untilDestroyed(this)).subscribe(val2 => {
          // Update user settings
          this.currentUser.menuId = val2.menuId;
          this.authenticationService.updateCurrentUser(this.currentUser);
          // Handle success response
          this.needSpinner = false;
          this.isFormChanged = false;
          this.menuId = val2.menuId;
          this.toastr.success('Menu Created');
          this.dataService.changeMenuCreate({ menuId: val2.menuId, needMenu: true });
        });
      });
    });
  }

  updateSettings() {
    if (!this.form.valid) {
      this.toastError();
      return;
    }
    const title = 'Confirm to update menu setting?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const settings = this.menuFormService.settingSetter(this.form);
      this.menuService.updateMenuSettings(this.restaurantId, this.menuId, settings).pipe(untilDestroyed(this)).subscribe(val => {
        // Handle success response
        this.needSpinner = false;
        this.isFormChanged = false;
        this.toastr.success('Menu Settings Updated');
      });
    });
  }

  orderModeHint() {
    const orderMode = this.form.get('orderMode').value;
    switch (orderMode) {
      case 'onlyDineIn': this.hintSender(38); break;
      case 'onlyTakeAway': this.hintSender(2); break;
      case 'all': this.hintSender(39); break;
      default: this.hintSender(40); break;
    }
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

  private toastError() {
    const invalid = this.commonService.findInvalidControls(this.form);
    let display = 'Invalid input for ';
    invalid.map(val => display += ` ${this.getInputName(val)}, `);
    this.toastr.error(display.slice(0, -2), '', { 'timeOut': 5000 });
  }

  private getInputName(val) {
    switch (val) {
      case 'orderMode': return '"Order Mode"';
      case 'paymentMethodDineIn': return '"Dine in payment method"';
      case 'paymentMethodOnline': return '"Online payment method"';
      case 'taxPercentage': return '"Service tax percentage"';
      case 'serviceChargePercentage': return '"Service charge percentage"';
      case 'hasTakeAway': return '"Open for take way"';
      case 'takeAwayFee': return '"Take away charges"';
    }
  }

}
