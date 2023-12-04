import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-m-r-category',
  templateUrl: './m-r-category.component.html',
  styleUrls: ['./m-r-category.component.scss']
})
export class MRCategoryComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  // Common properties
  menuId: string;
  categoryId: string;

  validation_messages: any;

  needCategoryForm: boolean = false;

  constructor(
    public hintService: HintService,
    public dataService: DataService,
    public menuFormService: MenuFormService,
    public authenticationService: AuthenticationService,
    private atp: AmazingTimePickerService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.menuId = this.authenticationService.currentUserValue.menuId;
    this.validation_messages = this.menuFormService.mRCategoryValidationMessage();
    this.setUpForm();
    this.listenToMLFood();
    this.listenToFormChanges();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.menuFormService.currentMenuRightCategoryForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  private listenToMLFood() {
    this.dataService.currentFoodContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (!val.toComponent.includes('MRCategory')) {
        return;
      }
      if (val.type === 'Category') {
        if (val.categoryId) {
          this.categoryId = val.categoryId;
          this.needCategoryForm = val.needCategoryForm;
          const content = val.categoryContent;
          const query = {
            categoryName: val.categoryName,
            categoryNameTranslated: content.categoryNameTranslated
          };
          if (content) {
            query['hasLimitedTimeSection'] = this.checkTimeSection(content.limitedTimeSection);
            if (!lo_isEmpty(content.limitedTimeSection)) {
              query['startSection'] = content.limitedTimeSection.startSection;
              query['endSection'] = content.limitedTimeSection.endSection;
            }
          } else {
            query['startSection'] = '';
            query['endSection'] = '';
          }
          this.form.patchValue(query, { emitEvent: false, onlySelf: true });
        } else {
          this.categoryId = undefined;
          this.needCategoryForm = val.needCategoryForm;
          this.form.get('hasLimitedTimeSection').setValue(false, { emitEvent: false, onlySelf: true });
          this.reset();
        }
      }
    });
  }

  private listenToFormChanges() {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (this.categoryId !== undefined) {
        this.dataService.changeFoodsContent({
          toComponent: ['hint'],
          isFirstCreate: false,
          isFormChanged: true,
          buttonText: 'Update Category',
          formData: this.form,
        });
      } else {
        this.dataService.changeFoodsContent({
          toComponent: ['hint'],
          isFirstCreate: true,
          isFormChanged: true,
          buttonText: 'Create Category',
          formData: this.form,
        });
      }
    });
  }

  private onChanges() {
    this.form.get('hasLimitedTimeSection').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('startSection').enable();
        this.form.get('endSection').enable();
      } else {
        this.form.get('startSection').disable();
        this.form.get('endSection').disable();
      }
    });
  }

  private checkTimeSection(field) {
    if (!lo_isEmpty(field)) {
      this.form.get('startSection').enable();
      this.form.get('endSection').enable();
      return true;
    } else {
      this.form.get('startSection').disable();
      this.form.get('endSection').disable();
      return false;
    }
  }

  private reset() {
    this.form.reset('', { emitEvent: false, onlySelf: true });
  }

  openAtp(type) {
    const amazingTimePicker = this.atp.open({
      arrowStyle: { background: '#ff9566', color: 'white' }
    });
    amazingTimePicker.afterClose().subscribe(time => {
      this.form.get(type).setValue(time);
    });
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }

}
