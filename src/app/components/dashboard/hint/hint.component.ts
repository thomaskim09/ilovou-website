import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { HintMessageService } from 'src/app/providers/hint/hint-message/hint-message.service';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { ProfileFormService } from 'src/app/providers/profile/profileForm/profile-form.service';
import { ProfileService } from 'src/app/providers/profile/profile.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VoucherFormService } from 'src/app/providers/voucher/voucherForm/voucher-form.service';
import { VoucherService } from 'src/app/providers/voucher/voucher.service';
import { VoucherViewService } from 'src/app/providers/voucher/voucherView/voucher-view.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss']
})
export class HintComponent implements OnInit, OnChanges, OnDestroy {

  @Input('form') form: any;

  // Hint message
  message: string;
  hint: any;

  // Voucher Page
  isViewMode: boolean;

  // Menu Page
  type: string;
  isFirstCreate: boolean = true;
  isFormChanged: boolean = false;
  isFoodNameChanged: boolean = false;
  isCategoryChanged: boolean = false;
  oldCategory: string;
  buttonText: string;
  categoryId: string;
  categoryOrder: number;
  foodId: string;
  foodOrder: number;

  // profile form button
  isNewAdmin: boolean = false;

  // JS properties
  currentUser: any;
  trialDetails: any;

  // Controller
  timer: any;
  needSpinner: boolean = false;

  constructor(
    public hintService: HintService,
    public hintMessageService: HintMessageService,
    public profileService: ProfileService,
    public profileFormService: ProfileFormService,
    public voucherService: VoucherService,
    public voucherFormService: VoucherFormService,
    public voucherViewService: VoucherViewService,
    public menuService: MenuService,
    public menuFormService: MenuFormService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public router: Router,
    public dataService: DataService) { }

  ngOnInit() {
    this.currentUser = this.authenticationService.currentUserValue;
    this.initialHintMessage();
    this.checkIsNewAdmin();
    this.listenToVoucherViewRequest();
    this.listenToMenuFormRequest();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  ngOnChanges() {
    this.detectFormChanges();
  }

  private initialHintMessage() {
    this.hintService.currentMessage.pipe(untilDestroyed(this)).subscribe(message => {
      this.message = message;
      this.hint = this.setUpHintMessage(message);
    });
  }

  private setUpHintMessage(message) {
    switch (this.router.url) {
      case '/dashboard/profile': return this.hintMessageService.profileHintMessage(message);
      case '/dashboard/voucher': return this.hintMessageService.voucherHintMessage(message);
      case '/dashboard/reservation': return this.hintMessageService.reservationHintMessage(message);
      case '/dashboard/menu': return this.hintMessageService.menuHintMessage(message);
      case '/dashboard/bill': return this.hintMessageService.billHintMessage(message);
    }
  }

  private checkIsNewAdmin() {
    if (this.router.url !== '/dashboard/profile') {
      return;
    }
    this.isNewAdmin = this.currentUser.restaurantId ? true : false;
  }

  private listenToVoucherViewRequest() {
    if (this.router.url !== '/dashboard/voucher') {
      return;
    }
    this.voucherViewService.currentMessage.pipe(untilDestroyed(this)).subscribe(id => {
      if (lo_isEmpty(id)) {
        return;
      }
      this.isViewMode = (id === 'new') ? false : true;
    });
  }

  private listenToMenuFormRequest() {
    if (this.router.url !== '/dashboard/menu') {
      return;
    }
    this.dataService.currentFoodContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (!val.toComponent.includes('hint')) {
        return;
      }
      if (val.type === 'Food') {
        this.type = val.type;
        this.foodId = val.foodId;
        this.foodOrder = val.foodOrder;
      }
      if (val.type === 'Category') {
        this.type = val.type;
        this.categoryId = val.categoryId;
        this.categoryOrder = val.categoryOrder;
      }
      this.isFirstCreate = val.isFirstCreate;
      this.isFormChanged = val.isFormChanged;
      this.isFoodNameChanged = val.isFoodNameChanged;
      this.isCategoryChanged = val.isCategoryChanged;
      this.oldCategory = val.oldCategory;
      this.buttonText = val.buttonText;
      this.form = val.formData;
    });
  }

  private detectFormChanges() {
    this.timer = setTimeout(() => {
      this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        this.isFormChanged = true;
      });
    }, 2000);
  }

  private success(text) {
    this.toastr.success(text);
    this.isFormChanged = false;
  }

  addRestaurant() {
    const title = 'Confirm to create restaurant?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes' || !this.form.valid) {
        return;
      }
      this.needSpinner = true;
      const restaurant = this.profileFormService.restaurantSetter(this.form);
      const object = {
        adminId: this.currentUser._id,
        restaurant: restaurant,
        status: 'NV'
      };
      this.profileService.addRestaurant(object).pipe(untilDestroyed(this)).subscribe(val => {
        this.form.get('restaurantImage').setValue(val.restaurantImage);
        this.form.get('restaurantImageList').setValue(val.restaurantImageList);
        this.needSpinner = false;
        this.isNewAdmin = true;
        this.currentUser.restaurantName = val.restaurantName;
        this.currentUser.restaurantId = val.restaurantId;
        this.authenticationService.updateCurrentUser(this.currentUser);
        this.dataService.changeDashboard({ createStatus: 'restaurant' });
        this.success('Restaurant created!');
      });
    });
  }

  updateRestaurant() {
    const title = 'Confirm to update restaurant\'s information?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes' || !this.form.valid) {
        return;
      }
      this.needSpinner = true;
      const restaurant = this.profileFormService.restaurantSetter(this.form);
      this.profileService.updateRestaurant(this.currentUser.restaurantId, restaurant).pipe(untilDestroyed(this)).subscribe(val => {
        this.form.get('restaurantImage').setValue(val.restaurantImage);
        this.form.get('restaurantImageList').setValue(val.restaurantImageList);
        this.needSpinner = false;
        this.currentUser.restaurantName = restaurant.restaurantName;
        this.authenticationService.updateCurrentUser(this.currentUser);
        this.dataService.changeDashboard({ createStatus: 'restaurant' });
        this.success(`Restaurant's Information Updated`);
      });
    });
  }

  addVoucher() {
    const title = 'Confirm to create new voucher?';
    const message = 'Please confirm voucher\'s details, it <b>cannot be modified after created</b>';
    this.hintService.showModal(title, message, 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes' || !this.form.valid) {
        return;
      } else if (!this.currentUser.restaurantId) {
        this.toastr.error('Need to create a restaurant first');
        return;
      }
      this.needSpinner = true;
      const voucherLength = this.voucherViewService.getVoucherLengthValue;
      const restaurantId = this.currentUser.restaurantId;
      const voucher = this.voucherFormService.voucherSetter(this.form, voucherLength, restaurantId);
      if (voucher.restaurantList.length > 1) {
        this.voucherService.checkRestaurantListVoucher(voucher.restaurantList).pipe(untilDestroyed(this)).subscribe(val => {
          if (!val.length) {
            this.createVoucher(restaurantId, voucher);
          } else {
            this.voucherService.getBranchList(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val2 => {
              const branchList = val2;
              this.needSpinner = false;
              let message2 = `<div class='sub-message'>Restaurant listed below has <b>exceed 5 vouchers limit</b>.</div> `;
              message2 += `<ul>`;
              const filtered = branchList.filter(val3 => val.includes(val3._id));
              for (const item of filtered) {
                message2 += `<li>${item.name}</li>`;
              }
              message2 += `</ul>`;
              this.hintService.showModal('Cannot create new branch voucher', message2, 'Okay').pipe(untilDestroyed(this)).subscribe(result1 => {
                if (result1 !== 'yes') {
                  return;
                }
              });
            });
          }
        });
      } else {
        this.createVoucher(restaurantId, voucher);
      }
    });
  }

  private createVoucher(restaurantId, voucher) {
    this.voucherService.addVoucher(restaurantId, voucher).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      this.form.reset('', { emitEvent: false, onlySelf: true });
      this.voucherViewService.changeSubmitStatus(true);
      this.voucherViewService.changeMessage(val.voucherId);
      this.success('New voucher added');
    });
  }

  addCategory() {
    const title = 'Confirm to create new category?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const menuId = this.currentUser.menuId;
      const content = this.menuFormService.mRcategorySetter(this.form);
      content['order'] = this.categoryOrder;
      content['status'] = 'OP';
      this.menuService.createCategory(menuId, content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.dataService.changeFoodsContent({
          toComponent: ['MLFood', 'menu'],
          MLCategoryRefresh: true,
          needMenuRight: false,
          needCategoryForm: false,
        });
        this.success('New category created');
      });
    });
  }

  updateCategory() {
    const title = 'Confirm to update category?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const menuId = this.currentUser.menuId;
      const content = this.menuFormService.mRcategorySetter(this.form);
      content['order'] = this.categoryOrder;
      content['status'] = 'OP';
      this.menuService.updateCategory(menuId, this.categoryId, content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.dataService.changeFoodsContent({
          toComponent: ['MLFood', 'menu'],
          MLCategoryRefresh: true,
          needMenuRight: false,
          needCategoryForm: false,
        });
        this.success('Category updated');
      });
    });
  }

  addFood() {
    const title = 'Confirm to create new item?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const menuId = this.currentUser.menuId;
      const categoryId = this.form.controls.categoryId.value;
      const content = this.menuFormService.mRfoodSetter(this.form);
      content['order'] = this.foodOrder;
      this.menuService.createFood(menuId, categoryId, content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.dataService.changeFoodsContent({
          toComponent: ['MLFood', 'menu'],
          MLFoodRefresh: true,
          needMenuRight: false,
          needFoodForm: false,
          categoryId: categoryId,
        });
        this.type = 'Done';
        this.success('Item created');
      });
    });
  }

  updateFood() {
    const title = 'Confirm to update item?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const menuId = this.currentUser.menuId;
      const categoryId = this.form.controls.categoryId.value;
      const content = this.menuFormService.mRfoodSetter(this.form);
      content['order'] = this.foodOrder;
      content['categoryId'] = categoryId;
      const controller = {
        isFoodNameChanged: this.isFoodNameChanged,
        isCategoryChanged: this.isCategoryChanged,
        oldCategory: this.oldCategory,
      };
      this.menuService.updateFood(menuId, categoryId, this.foodId, content, controller).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        const catId = this.isCategoryChanged ? this.oldCategory : categoryId;
        this.dataService.changeFoodsContent({
          toComponent: ['MLFood', 'menu'],
          MLFoodRefresh: true,
          needMenuRight: false,
          needFoodForm: false,
          categoryId: catId,
        });
        this.type = 'Done';
        this.success('Item updated');
      });
    });
  }
}
