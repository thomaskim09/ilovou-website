import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ProfileFormService } from 'src/app/providers/profile/profileForm/profile-form.service';
import { ProfileService } from 'src/app/providers/profile/profile.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../providers/common/common-form.service';
import { ImageCropModalComponent } from './../../modals/image-crop-modal/image-crop-modal.component';
import { CommonService } from './../../../../providers/common/common.service';
import { MatDialog } from '@angular/material';
import lo_orderBy from 'lodash/orderBy';

// interface for select drop down
interface Tag {
  id: string;
  name: string;
  parentId: string;
}

@Component({
  selector: 'app-profile-right',
  templateUrl: './profile-right.component.html',
  styleUrls: ['./profile-right.component.scss']
})
export class ProfileRightComponent implements OnInit, OnDestroy {

  // form properties
  @Input('form') form;

  // JS properties
  allStateList = [];
  allCityList = [];
  allPostcodeList = [];
  allAreaList = [];
  allPlaceList = [];
  allStreetList = [];

  // state select
  stateFilterCtrl: FormControl = new FormControl();
  stateOptions: Tag[] = [];
  filteredState: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // city select
  cityFilterCtrl: FormControl = new FormControl();
  cityOptions: Tag[] = [];
  filteredCity: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // postcodes whole list
  postcodesChildrenList: any;
  filteredAreaList: any;

  // postcode select
  postcodeFilterCtrl: FormControl = new FormControl();
  postcodeOptions: Tag[] = [];
  filteredPostcode: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // area select
  areaFilterCtrl: FormControl = new FormControl();
  areaOptions: Tag[] = [];
  filteredArea: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // street select
  streetFilterCtrl: FormControl = new FormControl();
  streetOptions: Tag[] = [];
  filteredStreet: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // place select
  placeFilterCtrl: FormControl = new FormControl();
  placeOptions: Tag[] = [];
  filteredPlace: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // Validation
  validation_messages;

  constructor(
    public hintService: HintService,
    public profileService: ProfileService,
    public profileFormService: ProfileFormService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public cfs: CommonFormService,
    public dialog: MatDialog,
    public commonService: CommonService) { }

  ngOnInit() {
    this.validation_messages = this.profileFormService.profileRightValidationMessage();
    this.preSetUpAddressList();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private preSetUpAddressList() {
    this.profileService.getAllAddress().pipe(untilDestroyed(this)).subscribe(val => {
      val.map(val2 => {
        this.allStateList.push({
          id: val2._id,
          name: val2.state
        });
        val2.cities.map(val3 => {
          this.allCityList.push({
            id: val3._id,
            name: val3.city,
            parentId: val2._id
          });
          val3.postcodes.map(val4 => {
            this.allPostcodeList.push({
              id: val4._id,
              name: val4.postcode,
              parentId: val3._id
            });
            val4.areas.map(val5 => {
              this.allAreaList.push({
                id: val5._id,
                name: val5.area,
                parentId: val4._id
              });
              val5.places.map(val6 => {
                this.allPlaceList.push({
                  id: val6._id,
                  name: val6.place,
                  parentId: val5._id
                });
              });
              val5.streets.map(val6 => {
                this.allStreetList.push({
                  id: val6._id,
                  name: val6.street,
                  parentId: val5._id
                });
              });
            });
          });
        });
      });
      this.stateOptions = this.allStateList;
      this.setUpState();
      this.patchAddress();
    });
  }

  private onChanges() {
    this.form.get('state').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.cityOptions = this.allCityList.filter(val2 => val2.parentId === val);
      this.disableAddress('state');
      this.setUpCity();
    });

    this.form.get('city').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.postcodeOptions = this.allPostcodeList.filter(val2 => val2.parentId === val);
      this.disableAddress('city');
      this.setUpPostcode();
    });

    this.form.get('postcode').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.areaOptions = this.allAreaList.filter(val2 => val2.parentId === val);
      this.disableAddress('postcode');
      this.setUpArea();
    });

    this.form.get('area').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      this.placeOptions = this.allPlaceList.filter(val2 => val2.parentId === val);
      this.allStreetList = lo_orderBy(this.allStreetList, [val2 => val2.name.toLowerCase()], ['asc']);
      this.streetOptions = this.allStreetList.filter(val2 => val2.parentId === val);
      this.disableAddress('area');
      this.setUpStreet();
      this.setUpPlace();
    });
  }

  private patchAddress() {
    const fv = this.form.value;
    const stateValue = fv.state;
    const cityValue = fv.city;
    const postcodeValue = fv.postcode;
    const areaValue = fv.area;
    if (stateValue) {
      this.cityOptions = this.allCityList.filter(val3 => {
        return val3.parentId === stateValue;
      });
      this.setUpCity();
    }
    if (cityValue) {
      this.postcodeOptions = this.allPostcodeList.filter(val3 => {
        return val3.parentId === cityValue;
      });
      this.setUpPostcode();
    }
    if (postcodeValue) {
      this.areaOptions = this.allAreaList.filter(val3 => {
        return val3.parentId === postcodeValue;
      });
      this.setUpArea();
    }
    if (areaValue) {
      this.placeOptions = this.allPlaceList.filter(val3 => {
        return val3.parentId === areaValue;
      });
      this.setUpPlace();
      this.streetOptions = this.allStreetList.filter(val3 => {
        return val3.parentId === areaValue;
      });
      this.setUpStreet();
    }
  }

  private setUpState() {
    this.filteredState.next(this.stateOptions.slice());
    this.stateFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredState.next(
        this.filterTag(this.stateOptions, this.stateFilterCtrl)
      );
    });
  }

  private setUpCity() {
    this.filteredCity.next(this.cityOptions.slice());
    this.cityFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredCity.next(
        this.filterTag(this.cityOptions, this.cityFilterCtrl)
      );
    });
  }

  private setUpPostcode() {
    this.filteredPostcode.next(this.postcodeOptions.slice());
    this.postcodeFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredPostcode.next(
        this.filterTag(this.postcodeOptions, this.postcodeFilterCtrl)
      );
    });
  }

  private setUpArea() {
    this.filteredArea.next(this.areaOptions.slice());
    this.areaFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredArea.next(
        this.filterTag(this.areaOptions, this.areaFilterCtrl)
      );
    });
  }

  private setUpStreet() {
    this.filteredStreet.next(this.streetOptions.slice());
    this.streetFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredStreet.next(
        this.filterTag(this.streetOptions, this.streetFilterCtrl)
      );
    });
  }

  private setUpPlace() {
    this.filteredPlace.next(this.placeOptions.slice());
    this.placeFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredPlace.next(
        this.filterTag(this.placeOptions, this.placeFilterCtrl)
      );
    });
  }

  clearPlace(event) {
    event.stopPropagation();
    this.form.get('address').get('place').reset();
  }

  detectLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.form.get('latitude').setValue(latitude);
        this.form.get('longitude').setValue(longitude);
        const location = 'Latitude: ' + latitude.toFixed(2) + ' Longitude: ' + longitude.toFixed(2);
        this.form.get('locationTemp').setValue(location);
        this.toastr.success('Location detected');
      });
    } else {
      this.toastr.error('Geolocation is not supported by this browser.');
    }
  }

  private disableAddress(type) {
    const emit = { emitEvent: false };
    switch (type) {
      case 'state': {
        this.form.get('city').setValue(undefined, emit);
        this.form.get('city').enable(emit);

        this.form.get('postcode').setValue(undefined, emit);
        this.form.get('area').setValue(undefined, emit);
        this.form.get('street').setValue(undefined, emit);
        this.form.get('place').setValue(undefined, emit);

        this.form.get('postcode').disable(emit);
        this.form.get('area').disable(emit);
        this.form.get('street').disable(emit);
        this.form.get('place').disable(emit);
        break;
      } case 'city': {
        this.form.get('postcode').setValue(undefined, emit);
        this.form.get('postcode').enable(emit);

        this.form.get('area').setValue(undefined, emit);
        this.form.get('street').setValue(undefined, emit);
        this.form.get('place').setValue(undefined, emit);

        this.form.get('area').disable(emit);
        this.form.get('street').disable(emit);
        this.form.get('place').disable(emit);
        break;
      } case 'postcode': {
        this.form.get('area').setValue(undefined, emit);
        this.form.get('area').enable(emit);

        this.form.get('street').setValue(undefined, emit);
        this.form.get('place').setValue(undefined, emit);

        this.form.get('street').disable(emit);
        this.form.get('place').disable(emit);
        break;
      } case 'area': {
        this.form.get('street').setValue(undefined, emit);
        this.form.get('place').setValue(undefined, emit);

        this.form.get('street').enable(emit);
        this.form.get('place').enable(emit);
        break;
      }
    }
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

  showImageCropModal() {
    const dialogRef = this.dialog.open(ImageCropModalComponent, { width: '25%', });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.commonService.compressImage(val, this.form.get('restaurantImageList'), true, true);
      }
    });
  }

  removePicture(i) {
    const list = this.form.get('restaurantImageList').value;
    list.splice(i, 1);
    this.form.get('restaurantImageList').setValue(list);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
