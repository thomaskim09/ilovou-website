import { AboveOneValidator } from 'src/app/validators/aboveOne.validator';
import { AboveZeroValidator } from 'src/app/validators/aboveZero.validator';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { PositiveNumberValidator } from 'src/app/validators/positiveNumber.validator';
import { PriceDecimalValidator } from 'src/app/validators/priceDecimal.validator';
import { isBefore, startOfMinute } from 'date-fns';
import { validVoucher } from 'src/app/validators/voucher.validator';

@Injectable({
  providedIn: 'root'
})
export class VoucherFormService {

  private voucherForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createFormGroup());
  currentVoucherForm = this.voucherForm.asObservable();

  private voucherLeftForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createVoucherLeftFormGroup());
  currentVoucherLeftForm = this.voucherLeftForm.asObservable();

  constructor(public fb: FormBuilder) { }

  createFormGroup() {
    return this.fb.group({
      // Common
      voucherType: new FormControl('', [Validators.required]),
      voucherImage: new FormControl('', [Validators.required]),
      voucherName: new FormControl('', [Validators.required]),
      prefix: new FormControl(''),
      suffix: new FormControl(''),
      newPrice: new FormControl(''),
      basePrice: new FormControl(''),
      validFrom: new FormControl('', [Validators.required]),
      validUntil: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      restaurantList: new FormControl(''),
      ruleDetails: new FormControl({ value: [], disabled: true }),
      customRuleDetails: new FormControl([]),
      customRuleInput: new FormControl({ value: '', disabled: true }),
      // Set Voucher
      suitablePax: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      setDetails: this.fb.array([this.createSetDetails()]),
      // Quantity Voucher
      quantityUnit: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      quantityDetails: this.fb.array([this.createQuantityDetails()]),
      // Cash Voucher
      minimumSpend: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      // Monthly Voucher
      limitPerDay: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      monthlyDetails: this.fb.array([this.createMonthlyDetails()]),
      // Group Details
      groupVoucherModel: new FormControl(false),
      groupVoucherDetails: this.fb.array([this.createGroupDetails()]),
      // Limit Control
      limitedQuantityModel: new FormControl(false),
      limitedQuantity: new FormControl({ value: '', disabled: true }, [Validators.required, PositiveNumberValidator.validPositiveNumber]),
      limitedQuantityPerUserModel: new FormControl(false),
      limitedQuantityPerUser: new FormControl({ value: '', disabled: true }, [Validators.required, PositiveNumberValidator.validPositiveNumber]),
      limitedEndTimeModel: new FormControl(false),
      limitedEndTime: new FormControl({ value: '', disabled: true }, [Validators.required, PositiveNumberValidator.validPositiveNumber]),
      startSellingTimeModel: new FormControl(false),
      startSellingTime: new FormControl({ value: '', disabled: true }, [Validators.required, PositiveNumberValidator.validPositiveNumber]),
    }, {
      validator: validVoucher('newPrice', 'basePrice', 'groupVoucherModel', 'groupVoucherDetails')
    });
  }

  // Set Details Section
  resetSetDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const array = currentVoucherForm.get('setDetails') as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    const array2 = array.controls[0].get('setContent') as FormArray;
    for (let i = (array2.controls.length - 1); i > 0; i--) {
      array2.removeAt(i);
    }
    this.voucherForm.next(currentVoucherForm);
  }

  createSetDetails() {
    return this.fb.group({
      setTitle: new FormControl('', [Validators.required]),
      setContent: this.fb.array([this.createSetContentDetails()]),
    });
  }

  createSetContentDetails() {
    return this.fb.group({
      setName: new FormControl('', [Validators.required]),
      setUnit: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      setPrice: new FormControl('', Validators.compose([Validators.required, PositiveNumberValidator.validPositiveNumber, PriceDecimalValidator.validDecimal])),
    });
  }

  addSetDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentSetDetails = currentVoucherForm.get('setDetails') as FormArray;
    currentSetDetails.push(this.createSetDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteSetDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentSetDetails = currentVoucherForm.get('setDetails') as FormArray;
    currentSetDetails.removeAt(i);
    this.voucherForm.next(currentVoucherForm);
  }

  addSetContentDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentSetContent = (currentVoucherForm.get('setDetails') as FormArray).at(i).get('setContent') as FormArray;
    currentSetContent.push(this.createSetContentDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteSetContentDetails(i, j) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentSetContent = (currentVoucherForm.get('setDetails') as FormArray).at(i).get('setContent') as FormArray;
    currentSetContent.removeAt(j);
    this.voucherForm.next(currentVoucherForm);
  }

  // Group Details Section
  resetGroupDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const array = currentVoucherForm.get('groupVoucherDetails') as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    this.voucherForm.next(currentVoucherForm);
  }

  createGroupDetails() {
    return this.fb.group({
      groupQuantity: new FormControl('', Validators.compose([Validators.required, AboveOneValidator.validAboveOne])),
      groupPricePerUnit: new FormControl('', Validators.compose([Validators.required, PositiveNumberValidator.validPositiveNumber, PriceDecimalValidator.validDecimal])),
    });
  }

  addGroupVoucherDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentGroupVoucherDetails = currentVoucherForm.get('groupVoucherDetails') as FormArray;
    currentGroupVoucherDetails.push(this.createGroupDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteGroupVoucherDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentGroupVoucherDetails = currentVoucherForm.get('groupVoucherDetails') as FormArray;
    currentGroupVoucherDetails.removeAt(i);
    this.voucherForm.next(currentVoucherForm);
  }

  // Quantity Details Section
  resetQuantityDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const array = currentVoucherForm.get('quantityDetails') as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    const array2 = array.controls[0].get('quantityContent') as FormArray;
    for (let i = (array2.controls.length - 1); i > 0; i--) {
      array2.removeAt(i);
    }
    this.voucherForm.next(currentVoucherForm);
  }

  createQuantityDetails() {
    return this.fb.group({
      quantityTitle: new FormControl('', [Validators.required]),
      quantityContent: this.fb.array([this.createQuantityContentDetails()]),
    });
  }

  createQuantityContentDetails() {
    return this.fb.group({
      itemName: new FormControl('', [Validators.required]),
      itemNewPrice: new FormControl('', [Validators.required, PriceDecimalValidator.validDecimal]),
      itemPreviousPrice: new FormControl('', Validators.compose([Validators.required, PositiveNumberValidator.validPositiveNumber, PriceDecimalValidator.validDecimal])),
    });
  }

  addQuantityDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentQuantityDetails = currentVoucherForm.get('quantityDetails') as FormArray;
    currentQuantityDetails.push(this.createQuantityDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteQuantityDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentQuantityDetails = currentVoucherForm.get('quantityDetails') as FormArray;
    currentQuantityDetails.removeAt(i);
    this.voucherForm.next(currentVoucherForm);
  }

  addQuantityContentDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentQuantityContent = (currentVoucherForm.get('quantityDetails') as FormArray).at(i).get('quantityContent') as FormArray;
    currentQuantityContent.push(this.createQuantityContentDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteQuantityContentDetails(i, j) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentQuantityContent = (currentVoucherForm.get('quantityDetails') as FormArray).at(i).get('quantityContent') as FormArray;
    currentQuantityContent.removeAt(j);
    this.voucherForm.next(currentVoucherForm);
  }

  // Monthly Detail Section
  resetMonthlyDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const array = currentVoucherForm.get('monthlyDetails') as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    const array2 = array.controls[0].get('monthlyContent') as FormArray;
    for (let i = (array2.controls.length - 1); i > 0; i--) {
      array2.removeAt(i);
    }
    this.voucherForm.next(currentVoucherForm);
  }

  createMonthlyDetails() {
    return this.fb.group({
      monthlyTitle: new FormControl('', [Validators.required]),
      monthlyContent: this.fb.array([this.createMonthlyContentDetails()]),
    });
  }

  createMonthlyContentDetails() {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      unit: new FormControl('', Validators.compose([Validators.required, AboveZeroValidator.validAboveZero])),
      price: new FormControl('', Validators.compose([Validators.required, PositiveNumberValidator.validPositiveNumber, PriceDecimalValidator.validDecimal])),
    });
  }

  addMonthlyDetails() {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentDetails = currentVoucherForm.get('monthlyDetails') as FormArray;
    currentDetails.push(this.createMonthlyDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteMonthlyDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentDetails = currentVoucherForm.get('monthlyDetails') as FormArray;
    currentDetails.removeAt(i);
    this.voucherForm.next(currentVoucherForm);
  }

  addMonthlyContentDetails(i) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentContent = (currentVoucherForm.get('monthlyDetails') as FormArray).at(i).get('monthlyContent') as FormArray;
    currentContent.push(this.createMonthlyContentDetails());
    this.voucherForm.next(currentVoucherForm);
  }

  deleteMonthlyContentDetails(i, j) {
    const currentVoucherForm = this.voucherForm.getValue();
    const currentContent = (currentVoucherForm.get('monthlyDetails') as FormArray).at(i).get('monthlyContent') as FormArray;
    currentContent.removeAt(j);
    this.voucherForm.next(currentVoucherForm);
  }

  // Validation
  mainContentValidationMessage() {
    const validation_messages = {
      'voucherType': [
        { type: 'required', message: 'Voucher\'s type is required' },
      ],
      'suitablePax': [
        { type: 'required', message: 'Suitable pax is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' }
      ],
      'minimumSpend': [
        { type: 'required', message: 'Minimum spend is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' }
      ],
      'quantityUnit': [
        { type: 'required', message: 'Quantity unit is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' },
      ],
      'limitPerDay': [
        { type: 'required', message: 'Limit per day is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' }
      ],
      'voucherImage': [
        { type: 'required', message: 'Voucher\'s image is required' },
      ],
      'voucherName': [
        { type: 'required', message: 'Voucher\'s name is required' },
      ],
      'newPrice': [
        { type: 'required', message: 'New price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validNewPriceRange', message: 'Need to be above RM1.50 or exact RM0' },
        { type: 'validVoucherPrice', message: 'Need to be less than normal price' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ],
      'basePrice': [
        { type: 'required', message: 'Normal price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validVoucherPrice', message: 'Need to be bigger than promotion price' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ],
      'validFrom': [
        { type: 'required', message: 'Start date is required' },
      ],
      'validUntil': [
        { type: 'required', message: 'Expiry date is required' },
      ],
      'startTime': [
        { type: 'required', message: 'Start time is required' },
      ],
      'endTime': [
        { type: 'required', message: 'End time is required' },
      ]
    };
    return validation_messages;
  }

  setDetailsValidationMessage() {
    const validation_messages = {
      'setTitle': [
        { type: 'required', message: 'Title is required' },
      ],
      'setName': [
        { type: 'required', message: 'Name is required' },
      ],
      'setUnit': [
        { type: 'required', message: 'Unit is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' }
      ],
      'setPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ]
    };
    return validation_messages;
  }

  quantityDetailsValidationMessage() {
    const validation_messages = {
      'quantityTitle': [
        { type: 'required', message: 'Title is required' },
      ],
      'itemName': [
        { type: 'required', message: 'Name is required' },
      ],
      'itemNewPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ],
      'itemPreviousPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ]
    };
    return validation_messages;
  }

  monthlyDetailsValidationMessage() {
    const validation_messages = {
      'title': [
        { type: 'required', message: 'Title is required' },
      ],
      'name': [
        { type: 'required', message: 'Name is required' },
      ],
      'unit': [
        { type: 'required', message: 'Unit is required' },
        { type: 'validAboveZero', message: 'Need to be more than 0' }
      ],
      'price': [
        { type: 'required', message: 'Price is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
      ]
    };
    return validation_messages;
  }

  groupVoucherValidationMessage() {
    const validation_messages = {
      'groupQuantity': [
        { type: 'required', message: 'Quantity is required' },
        { type: 'validAboveOne', message: 'Need to be more than 1' },
        { type: 'validGroupUnit', message: 'Need to be higher than 1 / last unit' },
      ],
      'groupPricePerUnit': [
        { type: 'required', message: 'Price per unit is required' },
        { type: 'validZero', message: 'Voucher price cannot be 0 if need group voucher' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
        { type: 'validNewPriceRange', message: 'Need to be above RM1.50 or exact RM0' },
        { type: 'validDecimal', message: 'Need to be a correct price format' },
        { type: 'validGroup', message: 'Need to be lower than voucher price / last unit price' },
      ],
    };
    return validation_messages;
  }

  limitValidationMessage() {
    const validation_messages = {
      'limitedQuantity': [
        { type: 'required', message: 'Limited quantity is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
      ],
      'limitedQuantityPerUser': [
        { type: 'required', message: 'Limited quantity for each user is required' },
        { type: 'validPositiveNumber', message: 'Need to be a positive number' },
      ],
      'limitedEndTime': [
        { type: 'required', message: 'Limited selling time is required' },
      ],
      'startSellingTime': [
        { type: 'required', message: 'Start selling time is required' },
      ],
    };
    return validation_messages;
  }

  // Function needed when submitting
  voucherSetter(form, voucherLength, restaurantId) {
    const fv = form.value;
    const voucher = {
      // Common
      voucherName: `${fv.prefix}${fv.voucherName} ${fv.suffix}`,
      voucherImage: fv.voucherImage,
      voucherType: fv.voucherType,
      newPrice: fv.newPrice,
      basePrice: fv.basePrice,
      restaurantList: (fv.restaurantList) ? [restaurantId, ...fv.restaurantList] : [restaurantId],
      status: this.setVoucherStatus(fv),
      order: voucherLength,
      voucherRules: {
        validFrom: fv.validFrom,
        validUntil: fv.validUntil,
        startTime: fv.startTime,
        endTime: fv.endTime,
        ruleDetails: fv.ruleDetails,
        customRuleDetails: fv.customRuleDetails,
      },
      // Set Voucher
      suitablePax: fv.suitablePax,
      setDetails: fv.setDetails,
      // Quantity Voucher
      quantityUnit: fv.quantityUnit,
      quantityDetails: fv.quantityDetails,
      // Cash Voucher
      minimumSpend: fv.minimumSpend,
      // Monthly Voucher
      limitPerDay: fv.limitPerDay,
      monthlyDetails: fv.monthlyDetails,
      // Group Details
      groupVoucherDetails: fv.groupVoucherDetails,
      // Limit Control
      limitedQuantity: fv.limitedQuantity,
      limitedQuantityPerUser: fv.limitedQuantityPerUser,
      limitedEndTime: this.formatTime(fv.limitedEndTime),
      startSellingTime: this.formatTime(fv.startSellingTime),
    };
    this.cleanFields(voucher);
    this.cleanFields(voucher.voucherRules);
    this.cleanVoucherObjects(fv, voucher);
    this.cleanGroupOrLimit(fv, voucher);
    return voucher;
  }

  private formatTime(time) {
    return time ? startOfMinute(time) : undefined;
  }

  private cleanFields(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
  }

  private cleanVoucherObjects(formValue, obj) {
    const vl = formValue.voucherType;
    switch (vl) {
      case 'SV': {
        delete obj.quantityDetails;
        delete obj.monthlyDetails;
        break;
      }
      case 'QV': {
        delete obj.setDetails;
        delete obj.monthlyDetails;
        break;
      }
      case 'CV': {
        delete obj.setDetails;
        delete obj.quantityDetails;
        delete obj.monthlyDetails;
        delete obj.groupVoucherDetails;
        break;
      }
      case 'MV': {
        delete obj.setDetails;
        delete obj.quantityDetails;
        delete obj.groupVoucherDetails;
        delete obj.limitedQuantityPerUser;
        break;
      }
    }
  }

  private cleanGroupOrLimit(form, obj) {
    const vl = form.groupVoucherModel;
    if (vl) {
      delete obj.limitedQuantity;
      delete obj.limitedQuantityPerUser;
    } else if (vl === '' || vl === false) {
      delete obj.groupVoucherDetails;
    }
  }

  private setVoucherStatus(form) {
    if (form.startSellingTime) {
      if (isBefore(new Date(), form.startSellingTime)) {
        return 'WG';
      } else {
        return 'OP';
      }
    } else {
      return 'OP';
    }
  }

  // Voucher left list form
  createVoucherLeftFormGroup() {
    return this.fb.group({
      order: new FormControl(''),
    });
  }

}
