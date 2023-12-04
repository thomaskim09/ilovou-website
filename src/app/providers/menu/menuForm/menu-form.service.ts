import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { PriceDecimalValidator } from 'src/app/validators/priceDecimal.validator';

@Injectable({ providedIn: 'root' })
export class MenuFormService {

  private menuSettingForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createSettingFormGroup());
  currentMenuSettingForm = this.menuSettingForm.asObservable();

  private menuRemarkForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createRemarkFormGroup());
  currentMenuRemarkForm = this.menuRemarkForm.asObservable();

  private menuLeftFoodForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createLeftFoodFormGroup());
  currentMenuLeftFoodForm = this.menuLeftFoodForm.asObservable();

  private menuRightFoodForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createRightFoodFormGroup());
  currentMenuRightFoodForm = this.menuRightFoodForm.asObservable();

  private menuLeftCategoryForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createLeftCategoryFormGroup());
  currentMenuLeftCategoryForm = this.menuLeftCategoryForm.asObservable();

  private menuRightCategoryForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createRightCategoryFormGroup());
  currentMenuRightCategoryForm = this.menuRightCategoryForm.asObservable();

  constructor(public fb: FormBuilder) { }

  changeMenuSettingForm(options: any) {
    this.menuSettingForm.next(options);
  }

  changeMenuRemarkForm(options: any) {
    this.menuRemarkForm.next(options);
  }

  changeMenuLeftFoodForm(options: any) {
    this.menuLeftFoodForm.next(options);
  }

  changeMenuRightFoodForm(options: any) {
    this.menuRightFoodForm.next(options);
  }

  changeMenuRightCategoryForm(options: any) {
    this.menuRightCategoryForm.next(options);
  }

  // Settings section
  createSettingFormGroup() {
    return this.fb.group({
      hasMenu: new FormControl(false),
      hasTableNoLock: new FormControl({ value: false, disabled: true }),
      hasTableNoRange: new FormControl({ value: false, disabled: true }),
      tableNoRange: new FormControl({ value: '', disabled: true }, [Validators.required]),
      orderMode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      displayMode: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hasTranslation: new FormControl({ value: false, disabled: true }),
      hasCallService: new FormControl({ value: false, disabled: true }),
      hasPayCounter: new FormControl({ value: false, disabled: true }),
      hasNotifyService: new FormControl({ value: false, disabled: true }),
      hasHideTotal: new FormControl({ value: false, disabled: true }),
      hasTax: new FormControl({ value: false, disabled: true }),
      taxPercentage: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hasServiceCharge: new FormControl({ value: false, disabled: true }),
      serviceChargePercentage: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hasTakeAway: new FormControl({ value: false, disabled: true }, [Validators.requiredTrue]),
      hasTakeAwayFee: new FormControl({ value: false, disabled: true }),
      hasTakeAwayPerPackage: new FormControl({ value: false, disabled: true }),
      takeAwayFee: new FormControl({ value: '', disabled: true }, Validators.compose([Validators.required, PriceDecimalValidator.validDecimal])),
      hasNotice: new FormControl({ value: false, disabled: true }),
      noticeTitle: new FormControl({ value: '', disabled: true }, [Validators.required]),
      noticeTitleTranslated: new FormControl({ value: '', disabled: true }),
      noticeContent: new FormControl({ value: '', disabled: true }, [Validators.required]),
      noticeContentTranslated: new FormControl({ value: '', disabled: true }),
    });
  }

  // Remark section
  resetRemarkContent() {
    const currentForm = this.menuRemarkForm.getValue();
    const array = currentForm.controls.remarkDetails as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    this.menuRemarkForm.next(currentForm);
  }

  createRemarkFormGroup() {
    return this.fb.group({
      remarkTitle: new FormControl('', [Validators.required]),
      remarkTitleTranslated: new FormControl(''),
      remarkType: new FormControl('', [Validators.required]),
      remarkDetails: this.fb.array([this.createRemarkDetails()]),
    });
  }

  createRemarkDetails() {
    return this.fb.group({
      remarkName: new FormControl('', [Validators.required]),
      remarkNameTranslated: new FormControl(''),
      remarkShortName: new FormControl(''),
      remarkPrice: new FormControl('', Validators.compose([Validators.required, PriceDecimalValidator.validDecimal]))
    });
  }

  addRemarkDetails() {
    const currentForm = this.menuRemarkForm.getValue();
    const currentChildren = currentForm.controls.remarkDetails as FormArray;
    currentChildren.push(this.createRemarkDetails());
    this.menuRemarkForm.next(currentForm);
  }

  deleteRemarkDetails(i) {
    const currentForm = this.menuRemarkForm.getValue();
    const currentChildren = currentForm.controls.remarkDetails as FormArray;
    currentChildren.removeAt(i);
    this.menuRemarkForm.next(currentForm);
  }

  // Category section
  createLeftCategoryFormGroup() {
    return this.fb.group({
      order: new FormControl(''),
    });
  }

  createRightCategoryFormGroup() {
    return this.fb.group({
      categoryName: new FormControl('', [Validators.required]),
      categoryNameTranslated: new FormControl(''),
      hasLimitedTimeSection: new FormControl(false),
      startSection: new FormControl({ value: '', disabled: true }, [Validators.required]),
      endSection: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  // Food section
  createLeftFoodFormGroup() {
    return this.fb.group({
      order: new FormControl(''),
    });
  }

  createRightFoodFormGroup() {
    return this.fb.group({
      itemName: new FormControl('', [Validators.required]),
      itemNameTranslated: new FormControl(''),
      categoryId: new FormControl('', [Validators.required]),
      itemShortName: new FormControl(''),
      itemCode: new FormControl(''),
      itemImage: new FormControl(''),
      itemPreviousImage: new FormControl(''),
      itemPrice: new FormControl('', Validators.compose([Validators.required, PriceDecimalValidator.validDecimal])),
      hasLimitedTimeSection: new FormControl(false),
      startSection: new FormControl({ value: '', disabled: true }, [Validators.required]),
      endSection: new FormControl({ value: '', disabled: true }, [Validators.required]),
      hasRemarkPopUp: new FormControl(false),
      description: new FormControl({ value: '', disabled: true }),
      descriptionTranslated: new FormControl({ value: '', disabled: true }),
      hasFixedRemark: new FormControl(false),
      hasDifferentRemark: new FormControl(false),
      remarkAuto: new FormControl({ value: '', disabled: true }),
      remarkManual: this.fb.array([this.createRemarkFormGroup()]),
    });
  }

  resetRemark() {
    const currentForm = this.menuRightFoodForm.getValue();
    const array = currentForm.controls.remarkManual as FormArray;
    for (let i = (array.controls.length - 1); i > 0; i--) {
      array.removeAt(i);
    }
    const array2 = array.controls[0].get('remarkDetails') as FormArray;
    for (let i = (array2.controls.length - 1); i > 0; i--) {
      array2.removeAt(i);
    }
    this.menuRightFoodForm.next(currentForm);
  }

  addRemarkParent() {
    const currentForm = this.menuRightFoodForm.getValue();
    const currentChildren = currentForm.controls.remarkManual as FormArray;
    currentChildren.push(this.createRemarkFormGroup());
    this.menuRightFoodForm.next(currentForm);
  }

  deleteRemarkParent(i) {
    const currentForm = this.menuRightFoodForm.getValue();
    const currentChildren = currentForm.controls.remarkManual as FormArray;
    currentChildren.removeAt(i);
    this.menuRightFoodForm.next(currentForm);
  }

  addRemarkChildren(i) {
    const currentForm = this.menuRightFoodForm.getValue();
    const currentChildren = (currentForm.controls.remarkManual as FormArray).at(i).get('remarkDetails') as FormArray;
    currentChildren.push(this.createRemarkDetails());
    this.menuRightFoodForm.next(currentForm);
  }

  deleteRemarkChildren(i, j) {
    const currentForm = this.menuRightFoodForm.getValue();
    const currentChildren = (currentForm.controls.remarkManual as FormArray).at(i).get('remarkDetails') as FormArray;
    currentChildren.removeAt(j);
    this.menuRightFoodForm.next(currentForm);
  }

  mLSettingValidationMessage() {
    const validation_messages = {
      'tableNoRange': [
        { type: 'required', message: 'Table number range is required' },
      ],
      'orderMode': [
        { type: 'required', message: 'Order service\'s type is required' },
      ],
      'displayMode': [
        { type: 'required', message: 'Display order\'s type is required' },
      ],
      'taxPercentage': [
        { type: 'required', message: 'Tax percentage is required' },
      ],
      'serviceChargePercentage': [
        { type: 'required', message: 'Service charge amount is required' },
      ],
      'takeAwayFee': [
        { type: 'required', message: 'Take away fee is required' },
        { type: 'validDecimal', message: 'Must be a correct price format' },
      ],
      'noticeTitle': [
        { type: 'required', message: 'Notice title is required' },
      ],
      'noticeContent': [
        { type: 'required', message: 'Notice content is required' },
      ],
    };
    return validation_messages;
  }

  mLRemarkValidationMessage() {
    const validation_messages = {
      'remarkTitle': [
        { type: 'required', message: 'Remark\'s title is required' },
      ],
      'remarkType': [
        { type: 'required', message: 'Type is required' },
      ],
      'remarkName': [
        { type: 'required', message: 'Remark\'s name is required' },
      ],
      'remarkPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validDecimal', message: 'Must be a correct price format' },
      ],
    };
    return validation_messages;
  }

  mRCategoryValidationMessage() {
    const validation_messages = {
      'categoryName': [
        { type: 'required', message: 'Category\'s name is required' },
      ],
      'startSection': [
        { type: 'required', message: 'Start section is required' },
      ],
      'endSection': [
        { type: 'required', message: 'End section is required' },
      ],
    };
    return validation_messages;
  }

  mRFoodValidationMessage() {
    const validation_messages = {
      'itemName': [
        { type: 'required', message: 'Item\'s name is required' },
      ],
      'categoryId': [
        { type: 'required', message: 'Category is required' },
      ],
      'itemPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validDecimal', message: 'Must be a correct price format' },
      ],
      'startSection': [
        { type: 'required', message: 'Start section is required' },
      ],
      'endSection': [
        { type: 'required', message: 'End section is required' },
      ],
      'remarkAuto': [
        { type: 'required', message: 'Remark short cut is required' },
      ],
      'remarkTitle': [
        { type: 'required', message: 'Remark\'s title is required' },
      ],
      'remarkType': [
        { type: 'required', message: 'Type is required' },
      ],
      'remarkName': [
        { type: 'required', message: 'Remark\'s name is required' },
      ],
      'remarkPrice': [
        { type: 'required', message: 'Price is required' },
        { type: 'validDecimal', message: 'Must be a correct price format' },
      ]
    };
    return validation_messages;
  }

  settingSetter(form) {
    const vl = form.value;
    const settings = {
      hasMenu: vl.hasMenu,
      securityDetails: {
        hasTableNoLock: vl.hasTableNoLock,
        hasTableNoRange: vl.hasTableNoRange,
        tableNoRange: vl.tableNoRange,
      },
      modeDetails: {
        orderMode: vl.orderMode,
        displayMode: vl.displayMode,
      },
      commonDetails: {
        hasTranslation: vl.hasTranslation,
        hasCallService: vl.hasCallService,
        hasPayCounter: vl.hasPayCounter,
        hasNotifyService: vl.hasNotifyService,
        hasHideTotal: vl.hasHideTotal,
      },
      totalDetails: {
        hasTax: vl.hasTax,
        taxPercentage: vl.taxPercentage,
        hasServiceCharge: vl.hasServiceCharge,
        serviceChargePercentage: vl.serviceChargePercentage,
        hasTakeAway: vl.hasTakeAway,
        hasTakeAwayFee: vl.hasTakeAwayFee,
        hasTakeAwayPerPackage: vl.hasTakeAwayPerPackage,
        takeAwayFee: vl.takeAwayFee
      },
      noticeDetails: {
        hasNotice: vl.hasNotice,
        noticeTitle: vl.noticeTitle,
        noticeTitleTranslated: vl.noticeTitleTranslated,
        noticeContent: vl.noticeContent,
        noticeContentTranslated: vl.noticeContentTranslated
      }
    };
    this.cleanFields(settings);
    return settings;
  }

  remarksSetter(form) {
    const vl = form.value;
    const content = {
      remarkTitle: vl.remarkTitle,
      remarkTitleTranslated: vl.remarkTitleTranslated,
      remarkType: vl.remarkType,
      remarkDetails: vl.remarkDetails
    };
    this.cleanFields(content);
    return content;
  }

  mRcategorySetter(form) {
    const vl = form.value;
    const result = {
      categoryName: vl.categoryName,
      categoryNameTranslated: vl.categoryNameTranslated,
      limitedTimeSection: {
        startSection: vl.startSection,
        endSection: vl.endSection,
      },
      status: 'OP',
    };
    this.cleanCategoryUncheckedFields(vl, result);
    return result;
  }

  mRfoodSetter(form) {
    const vl = form.value;
    const result = {
      itemName: vl.itemName,
      itemNameTranslated: vl.itemNameTranslated,
      itemShortName: vl.itemShortName,
      itemCode: vl.itemCode,
      itemImage: vl.itemImage,
      itemPreviousImage: vl.itemPreviousImage,
      itemPrice: vl.itemPrice,
      limitedTimeSection: {
        startSection: vl.startSection,
        endSection: vl.endSection,
      },
      details: {
        needRemark: vl.hasRemarkPopUp,
        description: vl.description,
        descriptionTranslated: vl.descriptionTranslated,
        remarkAuto: vl.remarkAuto,
        remarkManual: vl.remarkManual,
      },
      status: 'OP',
    };
    this.cleanFoodUncheckedFields(vl, result);
    return result;
  }

  private cleanFields(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
        delete obj[propName];
      }
    }
  }

  private cleanCategoryUncheckedFields(value, obj) {
    if (!value.hasLimitedTimeSection) {
      delete obj['limitedTimeSection'];
    }
  }

  private cleanFoodUncheckedFields(value, obj) {
    if (!value.hasLimitedTimeSection) {
      delete obj['limitedTimeSection'];
    }
    if (!value.hasFixedRemark) {
      delete obj['details']['remarkAuto'];
    }
    if (!value.hasDifferentRemark) {
      delete obj['details']['remarkManual'];
    }
    if (!value.hasRemarkPopUp) {
      delete obj['details']['description'];
      delete obj['details'];
    }
  }

}
