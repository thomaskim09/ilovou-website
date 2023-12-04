import { AuthenticationService } from '../../authentication/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ContactValidator } from 'src/app/validators/contact.validator';
import { FoodTypeValidator } from 'src/app/validators/foodType.validator';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TimePickerValidator } from 'src/app/validators/timePicker.validator';
import { CommonService } from 'src/app/providers/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileFormService {

  private profileForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createFormGroup());
  currentProfileForm = this.profileForm.asObservable();

  constructor(
    public fb: FormBuilder,
    public authenticationService: AuthenticationService,
    public commonService: CommonService) { }

  changeProfileForm(options: any) {
    this.profileForm.next(options);
  }

  createFormGroup() {
    return this.fb.group({
      restaurantName: new FormControl('', [Validators.required]),
      restaurantType: new FormControl('', [Validators.required]),
      contact: new FormControl('', Validators.compose([Validators.required])), // ContactValidator.validCountryPhone()
      restriction: new FormControl('', [Validators.required]),
      isVegetarian: new FormControl(false),
      restaurantImage: new FormControl('', [Validators.required]),
      restaurantImageList: new FormControl([]),
      foodType: new FormControl('', Validators.compose([Validators.required, FoodTypeValidator.validFoodType])),
      restDayModel: new FormControl(['0']),
      businessHours: this.fb.array(this.createBusinessHours()),
      fixedBusinessHours: this.fb.array([this.createFixedBusinessHours()]),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      place: new FormControl(''),
      shortAreaName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(30)])),
      fullAddress: new FormControl('', [Validators.required]),
      longitude: new FormControl('', [Validators.required]),
      latitude: new FormControl('', [Validators.required]),
      locationTemp: new FormControl({ value: '', disabled: true }, [Validators.required])
    });
  }

  createFixedBusinessHours() {
    return this.fb.group({
      fixedOpenTime: new FormControl(''),
      fixedCloseTime: new FormControl(''),
    });
  }

  addFixedSection() {
    const currentProfileForm = this.profileForm.getValue();
    const currentSection = currentProfileForm.controls.fixedBusinessHours as FormArray;
    currentSection.push(this.createFixedBusinessHours());

    this.profileForm.next(currentProfileForm);
  }

  deleteFixedSection(i) {
    const currentProfileForm = this.profileForm.getValue();
    const currentSection = currentProfileForm.controls.fixedBusinessHours as FormArray;
    currentSection.removeAt(i);

    this.profileForm.next(currentProfileForm);
  }

  createBusinessHours() {
    const control = [];
    for (let i = 1; i <= 7; ++i) {
      control.push(
        this.fb.group({
          day: i,
          section: this.fb.array([this.createSection()]),
        })
      );
    }
    return control;
  }

  createSection() {
    return this.fb.group({
      openTime: new FormControl('', TimePickerValidator.validTimePicker),
      closeTime: new FormControl('', TimePickerValidator.validTimePicker),
    });
  }

  addSection(i) {
    const currentProfileForm = this.profileForm.getValue();
    const currentSection = (currentProfileForm.controls.businessHours as FormArray).at(i).get('section') as FormArray;
    currentSection.push(this.createSection());

    this.profileForm.next(currentProfileForm);
  }

  deleteSection(i, j) {
    const currentProfileForm = this.profileForm.getValue();
    const currentSection = (currentProfileForm.controls.businessHours as FormArray).at(i).get('section') as FormArray;
    currentSection.removeAt(j);

    this.profileForm.next(currentProfileForm);
  }

  profileLeftValidationMessage() {
    const validation_messages = {
      'restaurantName': [
        { type: 'required', message: 'Restaurant\'s name is required' },
      ],
      'restaurantType': [
        { type: 'required', message: 'Restaurant\'s type is required' }
      ],
      'contact': [
        { type: 'required', message: 'Restaurant\'s contact is required' },
        { type: 'validCountryPhone', message: 'Invalid phone number' },
      ],
      'foodType': [
        { type: 'required', message: 'Keywords is required' },
        { type: 'validFoodType', message: 'Maximum can choose 5 keywords only' },
      ],
      'restriction': [
        { type: 'required', message: 'Permissible food and drinks is required' },
      ],
      'openTime': [
        { type: 'required', message: 'Open time is required' }
      ],
      'closeTime': [
        { type: 'required', message: 'Close time is required' }
      ]
    };
    return validation_messages;
  }

  profileRightValidationMessage() {
    const validation_messages = {
      'state': [
        { type: 'required', message: 'State is required' }
      ],
      'city': [
        { type: 'required', message: 'City is required' }
      ],
      'postcode': [
        { type: 'required', message: 'Postcode is required' }
      ],
      'area': [
        { type: 'required', message: 'Area is required' }
      ],
      'street': [
        { type: 'required', message: 'Street is required' }
      ],
      'shortAreaName': [
        { type: 'required', message: 'Short area description is required' },
        { type: 'maxlength', message: 'Descriptions cannot be longer than 30 characters' },
      ],
      'fullAddress': [
        { type: 'required', message: 'Short area description is required' },
      ],
      'locationTemp': [
        { type: 'required', message: 'Location is required' },
      ]
    };
    return validation_messages;
  }

  // Function needed when submitting

  restaurantSetter(form1) {
    const fv = form1.value;
    const restaurant = {
      restaurantName: fv.restaurantName,
      restaurantType: fv.restaurantType,
      restaurantImage: fv.restaurantImage,
      restaurantImageList: fv.restaurantImageList,
      contact: fv.contact,
      restriction: fv.restriction,
      isVegetarian: fv.isVegetarian,
      address: {
        street: fv.street,
        area: fv.area,
        postcode: fv.postcode,
        city: fv.city,
        state: fv.state
      },
      place: fv.place,
      location: {
        type: 'Point',
        coordinates: [
          fv.longitude,
          fv.latitude,
        ]
      },
      fullAddress: fv.fullAddress,
      shortAreaName: fv.shortAreaName,
      routineRestDay: fv.restDayModel,
      businessHours: fv.businessHours,
      searchTags: fv.foodType
    };
    this.cleanFields(restaurant);
    return restaurant;
  }

  private cleanFields(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
  }

}
