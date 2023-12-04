import lo_isEmpty from 'lodash/isEmpty';
import lo_orderBy from 'lodash/orderBy';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { CommonService } from 'src/app/providers/common/common.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ImageCropModalComponent } from '../../../modals/image-crop-modal/image-crop-modal.component';
import { MatDialog } from '@angular/material';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

// interface for select drop down
interface Tag {
  id: string;
  name: string;
}

@Component({
  selector: 'app-m-r-food',
  templateUrl: './m-r-food.component.html',
  styleUrls: ['./m-r-food.component.scss']
})
export class MRFoodComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  // Common properties
  menuId: string;
  foodId: string;

  validation_messages: any;

  // Controller
  isFoodNameChanged: boolean = false;
  isCategoryChanged: boolean = false;
  oldCategory: string = undefined;
  isFirstCreate: boolean = true;
  needFoodForm: boolean = false;
  timer: any;
  needSpinner: boolean = false;

  // Category select
  categoryFilterCtrl: FormControl = new FormControl();
  categoryOptions: Tag[] = [];
  filteredCategory: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // Remark select
  remarkFilterCtrl: FormControl = new FormControl();
  remarkOptions: Tag[] = [];
  filteredRemark: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  typeList: any = [
    { name: 'Single Select', value: 'RB' },
    { name: 'Multiple Select', value: 'CB' },
  ];

  constructor(
    public hintService: HintService,
    public dialog: MatDialog,
    public authenticationService: AuthenticationService,
    public menuService: MenuService,
    public menuFormService: MenuFormService,
    public dataService: DataService,
    public commonService: CommonService,
    public atp: AmazingTimePickerService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.menuId = this.authenticationService.currentUserValue.menuId;
    this.validation_messages = this.menuFormService.mRFoodValidationMessage();
    this.setUpRemarkList();
    this.setUpCategoryList();
    this.setUpForm();
    this.listenToMLFood();
    this.onChanges();
    this.listenToFormChanges();
    this.disableSegmentFormField();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpForm() {
    this.menuFormService.currentMenuRightFoodForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private listenToMLFood() {
    this.dataService.currentFoodContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (!val.toComponent.includes('MRFood')) {
        return;
      }
      if (val.type === 'Food') {
        this.isFirstCreate = val.isFirstCreate;
        this.needFoodForm = val.needFoodForm;
        this.resetForm();
        if (!val.isFirstCreate) {
          this.foodId = val.foodId;
          this.setUpFoodDetails(val.foodId);
        }
      }
    });
  }

  openAtp(type) {
    const amazingTimePicker = this.atp.open({
      arrowStyle: { background: '#ff9566', color: 'white' }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      this.form.get(type).setValue(time);
    });
  }

  detectChanges() {
    if (this.oldCategory === undefined) {
      this.oldCategory = this.form.get('categoryId').value;
    }
  }

  private onChanges() {
    const con = this.form.controls;

    this.form.get('itemName').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.isFoodNameChanged = true;
    });
    this.form.get('itemPrice').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.isFoodNameChanged = true;
    });
    this.form.get('categoryId').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val !== this.oldCategory && this.oldCategory !== undefined) {
        this.isCategoryChanged = true;
      } else if (val === this.oldCategory) {
        this.isCategoryChanged = false;
      }
    });
    this.form.get('hasLimitedTimeSection').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        con.startSection.enable();
        con.endSection.enable();
      } else {
        con.startSection.disable();
        con.endSection.disable();
      }
    });
    this.form.get('hasRemarkPopUp').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        con.description.enable();
        con.descriptionTranslated.enable();
        con.hasFixedRemark.enable();
        con.hasDifferentRemark.enable();
      } else {
        con.description.disable();
        con.descriptionTranslated.disable();
        con.hasFixedRemark.disable();
        con.hasDifferentRemark.disable();
        con.remarkAuto.disable();
        con.remarkManual.disable();
      }
    });
    this.form.get('hasFixedRemark').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        con.remarkAuto.enable();
      } else {
        con.remarkAuto.disable();
      }
    });
    this.form.get('hasDifferentRemark').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        con.remarkManual.enable();
      } else {
        con.remarkManual.disable();
      }
    });
  }

  private listenToFormChanges() {
    this.timer = setTimeout(() => {
      this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        if (!this.isFirstCreate) {
          this.dataService.changeFoodsContent({
            toComponent: ['hint'],
            isFormChanged: true,
            isFirstCreate: false,
            buttonText: 'Update Item',
            formData: this.form,
            isFoodNameChanged: this.isFoodNameChanged,
            isCategoryChanged: this.isCategoryChanged,
            oldCategory: this.oldCategory,
          });
        } else {
          this.dataService.changeFoodsContent({
            toComponent: ['hint'],
            isFormChanged: true,
            isFirstCreate: true,
            buttonText: 'Create Item',
            formData: this.form,
            isFoodNameChanged: this.isFoodNameChanged,
          });
        }
      });
    }, 1000);
  }

  private disableSegmentFormField() {
    this.form.get('remarkManual').disable({ emitEvent: false, onlySelf: true });
  }

  addRemarkArray(remarkManual) {
    const formManual = this.form.value.remarkManual;
    for (let i = 0; i < remarkManual.length; ++i) {
      if (i !== 0 && formManual.length !== remarkManual.length) {
        this.addParent();
      }
      for (let j = 1; j < remarkManual[i].remarkDetails.length; j++) {
        this.addChildren(i);
      }
    }
  }

  setUpFoodDetails(foodId) {
    this.needSpinner = true;
    this.menuService.getFood(this.menuId, foodId).pipe(untilDestroyed(this)).subscribe(val => {
      this.needSpinner = false;
      const vl = val.itemDetails[0];
      const query = {
        itemName: vl.itemName,
        itemNameTranslated: vl.itemNameTranslated,
        itemShortName: vl.itemShortName,
        categoryId: vl.categoryId,
        itemCode: vl.itemCode,
        itemImage: vl.itemImage,
        itemPreviousImage: vl.itemImage,
        itemPrice: vl.itemPrice,
        hasLimitedTimeSection: this.checkTimeSection(vl.limitedTimeSection),
      };
      if (vl.details) {
        query['hasRemarkPopUp'] = this.checkOverallObject(vl.details.needRemark);
        query['description'] = vl.details.description;
        query['descriptionTranslated'] = vl.details.descriptionTranslated;
        query['hasFixedRemark'] = this.checkDetailsByType(vl.details, 'remarkAuto');
        query['hasDifferentRemark'] = this.checkDetailsByType(vl.details, 'remarkManual');
        query['remarkAuto'] = vl.details.remarkAuto;
        query['remarkManual'] = vl.details.remarkManual;
      }
      if (vl.limitedTimeSection && vl.limitedTimeSection.startSection) {
        query['startSection'] = vl.limitedTimeSection.startSection;
        query['endSection'] = vl.limitedTimeSection.endSection;
      }
      if (!this.checkDetailsByType(vl.details, 'remarkManual')) {
        delete query['remarkManual'];
      } else {
        this.addRemarkArray(vl.details.remarkManual);
      }
      this.form.patchValue(query, { emitEvent: false, onlySelf: true });
    });
  }

  private checkTimeSection(field) {
    if (!lo_isEmpty(field)) {
      this.form.get('startSection').enable({ emitEvent: false });
      this.form.get('endSection').enable({ emitEvent: false });
      return true;
    } else {
      this.form.get('startSection').disable({ emitEvent: false });
      this.form.get('endSection').disable({ emitEvent: false });
      return false;
    }
  }

  private checkDetailsByType(field, type) {
    if (field) {
      switch (type) {
        case 'remarkAuto': {
          if (field.remarkAuto) {
            if (field.remarkAuto.length !== 0) {
              const result = this.remarkOptions.filter(val => val.id === field.remarkAuto[0]);
              if (result.length === 0) {
                this.form.get('remarkAuto').disable({ emitEvent: false });
                return false;
              } else {
                this.form.get('remarkAuto').enable({ emitEvent: false });
                return true;
              }
            } else {
              this.form.get('remarkAuto').disable({ emitEvent: false });
              return false;
            }
          } else { return false; }
        } case 'remarkManual': {
          if (field.remarkManual) {
            if (field.remarkManual.length !== 0) {
              this.form.get('remarkManual').enable({ emitEvent: false });
              return true;
            } else {
              this.form.get('remarkManual').disable({ emitEvent: false });
              return false;
            }
          } else { return false; }
        } default: return false;
      }
    } else {
      return false;
    }
  }

  private checkOverallObject(object) {
    if (object) {
      this.form.controls.description.enable({ emitEvent: false });
      this.form.controls.descriptionTranslated.enable({ emitEvent: false });
      return true;
    } else {
      return false;
    }
  }

  private resetForm() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
    this.form.get('hasLimitedTimeSection').setValue(false);
    this.form.get('hasFixedRemark').setValue(false);
    this.form.get('hasDifferentRemark').setValue(false);
    this.menuFormService.resetRemark();
  }

  private setUpCategoryList() {
    this.menuService.getCategory(this.menuId, false).pipe(untilDestroyed(this)).subscribe(value => {
      const list2 = value.categoryDetails;
      const list3 = list2.map(val => ({
        id: val._id,
        name: val.categoryName
      }));
      this.categoryOptions = lo_orderBy(list3, [val => val.name.toLowerCase()], ['asc']);

      this.filteredCategory.next(this.categoryOptions.slice());
      this.categoryFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
        this.filteredCategory.next(this.filterTag(this.categoryOptions, this.categoryFilterCtrl));
      });
    });
  }

  private setUpRemarkList() {
    this.menuService.getRemarks(this.menuId, false).pipe(untilDestroyed(this)).subscribe(value => {
      const list2 = value.remarkShortCuts;
      if (list2) {
        const list3 = list2.map(val => ({
          id: val._id,
          name: val.remarkTitle
        }));
        this.remarkOptions = lo_orderBy(list3, [val => val.name.toLowerCase()], ['asc']);

        this.filteredRemark.next(this.remarkOptions.slice());
        this.remarkFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
          this.filteredRemark.next(this.filterTag(this.remarkOptions, this.remarkFilterCtrl));
        });
      }
    });
  }

  addParent() {
    this.menuFormService.addRemarkParent();
  }

  deleteParent(i) {
    this.menuFormService.deleteRemarkParent(i);
  }

  addChildren(i) {
    this.menuFormService.addRemarkChildren(i);
  }

  deleteChildren(i, j) {
    this.menuFormService.deleteRemarkChildren(i, j);
  }

  private filterTag(options, formControl) {
    if (!options) {
      return;
    }
    let search = formControl.value;
    if (!search) {
      return options.slice();
    } else {
      search = search.toLowerCase();
    }
    return options.filter(tag => tag.name.toLowerCase().indexOf(search) > -1);
  }

  showImageCropModal() {
    const dialogRef = this.dialog.open(ImageCropModalComponent, { width: '25%' });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.commonService.compressImage(val, this.form.get('itemImage'));
      }
    });
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
