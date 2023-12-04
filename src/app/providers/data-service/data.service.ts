import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

class Login {
  isLogin: boolean;
}

class SettingsTab {
  index: number;
  needMenuRight: boolean;
}

class RemarksContent {
  remarkId: string;
  needRemarkForm: boolean;
  MLRefresh: boolean;
  needMenuRight: boolean;
}

class FoodsContent {
  // Common properties
  toComponent: string;
  // Food section
  foodId: string;
  foodOrder: number;
  needFoodForm: boolean;
  MLFoodRefresh: boolean;
  isNewFood: boolean;
  isFoodNameChanged: boolean;
  isCategoryChanged: boolean;
  oldCategory: string;
  // Category section
  categoryId: string;
  categoryName: string;
  categoryOrder: number;
  categoryContent: any;
  needCategoryForm: boolean;
  MLCategoryRefresh: boolean;
  // Common section
  type: string;
  formData: any;
  needMenuRight: boolean;
  isFirstCreate: boolean;
  isFormChanged: boolean;
  buttonText: string;
}

class Bill {
  billContent: any;
  needVoucherRight: boolean;
  needHint: boolean;
}

class Dashboard {
  createStatus: string;
}

class MenuCreate {
  menuId: string;
  needMenu: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private loginSource = new BehaviorSubject(new Login());
  currentLogin = this.loginSource.asObservable();

  private settingsTabSource = new BehaviorSubject(new SettingsTab());
  currentSettingsTab = this.settingsTabSource.asObservable();

  private remarkContentSource = new BehaviorSubject(new RemarksContent());
  currentRemarkContent = this.remarkContentSource.asObservable();

  private foodContentSource = new BehaviorSubject(new FoodsContent());
  currentFoodContent = this.foodContentSource.asObservable();

  private billSource = new BehaviorSubject(new Bill());
  currentBill = this.billSource.asObservable();

  private dashboardSource = new BehaviorSubject(new Dashboard());
  currentDashboard = this.dashboardSource.asObservable();

  private menuCreateSource = new BehaviorSubject(new MenuCreate());
  currentMenuCreate = this.menuCreateSource.asObservable();

  constructor() { }

  changeLogin(options: any) {
    this.loginSource.next(options);
  }

  changeSettingsTab(options: any) {
    this.settingsTabSource.next(options);
  }

  changeRemarksContent(options: any) {
    this.remarkContentSource.next(options);
  }

  changeFoodsContent(options: any) {
    this.foodContentSource.next(options);
  }

  changeBill(options: any) {
    this.billSource.next(options);
  }

  changeDashboard(options: any) {
    this.dashboardSource.next(options);
  }

  changeMenuCreate(options: any) {
    this.menuCreateSource.next(options);
  }
}
