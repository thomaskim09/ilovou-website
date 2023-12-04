import lo_isEmpty from 'lodash/isEmpty';
import lo_orderBy from 'lodash/orderBy';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { CommonService } from 'src/app/providers/common/common.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ImageCropModalComponent } from '../../modals/image-crop-modal/image-crop-modal.component';
import { MatDialog } from '@angular/material';
import { ProfileFormService } from 'src/app/providers/profile/profileForm/profile-form.service';
import { ProfileService } from 'src/app/providers/profile/profile.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../providers/common/common-form.service';

// interface for select drop down
interface Tag {
  id: string;
  name: string;
}

@Component({
  selector: 'app-profile-left',
  templateUrl: './profile-left.component.html',
  styleUrls: ['./profile-left.component.scss']
})
export class ProfileLeftComponent implements OnInit, OnDestroy {

  // form properties
  @Input('form') form;

  // restaurant type select
  resTypeFilterCtrl: FormControl = new FormControl();
  resTypeOptions: Tag[] = [];
  filteredResType: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // food type select
  foodTypeMultiFilterCtrl: FormControl = new FormControl();
  foodTypeOptions: Tag[] = [];
  filteredFoodTypeMulti: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  restrictionType = [
    { name: 'None', value: 'NO' },
    { name: 'No Pork No Lard', value: 'PL' },
    { name: 'Halal', value: 'HL' },
  ];

  // Different day
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Date time
  fixedOpenTime: any;
  fixedCloseTime: any;

  // Validation
  validation_messages;

  constructor(
    public atp: AmazingTimePickerService,
    public profileService: ProfileService,
    public hintService: HintService,
    public dialog: MatDialog,
    public commonService: CommonService,
    public profileFormService: ProfileFormService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.profileFormService.profileLeftValidationMessage();
    this.onChanges();
    this.setUpTag();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private onChanges() {
    this.form.get('restDayModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      ['1', '2', '3', '4', '5', '6', '7'].map(val2 => {
        if (val.includes(val2)) {
          this.disableSelectedRestDayOne(+val2);
        } else {
          this.enableUnselectedRestDayOne(+val2);
        }
      });
    });
  }

  private enableUnselectedRestDayOne(day) {
    const section = (this.form.controls['businessHours'] as FormArray).at(day - 1).get('section') as FormArray;
    for (let j = 0; j < section.controls.length; j++) {
      section.controls[j].get('openTime').enable();
      section.controls[j].get('closeTime').enable();
    }
  }

  private disableSelectedRestDayOne(day) {
    const section = (this.form.controls['businessHours'] as FormArray).at(day - 1).get('section') as FormArray;
    for (let j = 0; j < section.controls.length; j++) {
      section.controls[j].get('openTime').disable();
      section.controls[j].get('closeTime').disable();
    }
  }

  private disableSelectedRestDay(valueObject) {
    // disable the selected rest day
    if (valueObject[0] !== '0') {
      for (const item of valueObject) {
        const day = +item;
        const section = (this.form.controls['businessHours'] as FormArray).at(day - 1).get('section') as FormArray;
        for (let j = 0; j < section.controls.length; j++) {
          section.controls[j].get('openTime').disable();
          section.controls[j].get('closeTime').disable();
          section.controls[j].get('openTime').setValue('');
          section.controls[j].get('closeTime').setValue('');
        }
      }
    }
  }

  openFixedOpenTimePicker(index, event) {
    event.stopPropagation();
    this.hintSender(7);
    const atp = this.atp.open({
      arrowStyle: { background: '#ff9566', color: 'white' }
    });
    atp.afterClose().subscribe(time => {
      this.fixedOpenTimeChange(index, time);
    });
  }

  openFixedCloseTimePicker(index, event) {
    event.stopPropagation();
    this.hintSender(13);
    const atp = this.atp.open({
      arrowStyle: { background: '#ff9566', color: 'white' }
    });
    atp.afterClose().subscribe(time => {
      this.fixedCloseTimeChange(index, time);
    });
  }

  private fixedOpenTimeChange(index, value) {
    if (this.fixedOpenTime !== value && !lo_isEmpty(value)) {
      this.form.get('fixedBusinessHours').controls[index].get('fixedOpenTime').setValue(value);
      this.fixedOpenTime = value;
      this.timeChange(value, index, 'openTime');
    }
  }

  private fixedCloseTimeChange(index, value) {
    if (this.fixedCloseTime !== value && !lo_isEmpty(value)) {
      this.form.get('fixedBusinessHours').controls[index].get('fixedCloseTime').setValue(value);
      this.fixedCloseTime = value;
      this.timeChange(value, index, 'closeTime');
    }
  }

  private timeChange(value, index, type) {
    for (let i = 0; i <= 6; ++i) {
      const j = i;
      if (this.form.controls.restDayModel.value.includes(String(j + 1))) {
        continue;
      }
      const section = (this.form.controls['businessHours'] as FormArray).at(i).get('section') as FormArray;
      section.controls[index].get(type).setValue(value);
    }
  }

  showImageCropModal() {
    const dialogRef = this.dialog.open(ImageCropModalComponent, { width: '25%', });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.commonService.compressImage(val, this.form.get('restaurantImage'));
      }
    });
  }

  addFixedSection() {
    this.profileFormService.addFixedSection();
    for (let i = 0; i <= 6; ++i) {
      this.addSection(i);
    }
    this.disableSelectedRestDay(this.form.get('restDayModel').value);
  }

  deleteFixedSection(j) {
    this.profileFormService.deleteFixedSection(j);
    for (let i = 0; i <= 6; ++i) {
      this.deleteSection(i, j);
    }
  }

  addSection(i) {
    this.profileFormService.addSection(i);
    this.disableSelectedRestDay(this.form.get('restDayModel').value);
  }

  deleteSection(i, j) {
    this.profileFormService.deleteSection(i, j);
  }

  private setUpTag() {
    this.profileService.getRestaurantFoodType().pipe(untilDestroyed(this)).subscribe(res => {
      // Process restaurant type
      const list = res.details.restaurantTypes;
      const list2 = lo_orderBy(list, [val => val.name.toLowerCase()], ['asc']);
      this.resTypeOptions = list2.map(val => ({
        id: val._id,
        name: val.name
      }));
      this.filteredResType.next(this.resTypeOptions.slice());
      this.resTypeFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
        this.filteredResType.next(this.filterTag(this.resTypeOptions, this.resTypeFilterCtrl));
      });

      // Process food type
      const list3 = res.details.foodTypes;
      const list4 = lo_orderBy(list3, [val => val.name.toLowerCase()], ['asc']);
      this.foodTypeOptions = list4.map(val => ({
        id: val._id,
        name: val.name
      }));
      this.filteredFoodTypeMulti.next(this.foodTypeOptions.slice());
      this.foodTypeMultiFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
        this.filteredFoodTypeMulti.next(this.filterTag(this.foodTypeOptions, this.foodTypeMultiFilterCtrl));
      });
    });
  }

  private filterTag(options, formControl) {
    if (!options) {
      return;
    }
    // get the search keyword
    let search = formControl.value;
    if (!search) {
      return options.slice();
    } else {
      search = search.toLowerCase();
    }
    // filter the tags
    return options.filter(tag => tag.name.toLowerCase().indexOf(search) > -1);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
