import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';
import { validPax } from 'src/app/validators/pax.validator';

@Injectable({
  providedIn: 'root'
})
export class ReservationFormService {

  private reservationForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createFormGroup());
  currentReservationForm = this.reservationForm.asObservable();

  constructor(public fb: FormBuilder) { }

  createFormGroup() {
    return this.fb.group({
      reservationModel: new FormControl(false),
      maxReservationDay: new FormControl({ value: false, disabled: true }, [Validators.required]),
      minPax: new FormControl({ value: 1, disabled: true }, [Validators.required]),
      maxPax: new FormControl({ value: '', disabled: true }, [Validators.required]),
      holidayModel: new FormControl({ value: false, disabled: true }),
      holidays: this.fb.array([this.createHoliday()]),
      hasDifferentRemark: new FormControl({ value: false, disabled: true }),
      remarkManual: this.fb.array([this.createRemarkFormGroup()]),
    }, {
      validator: validPax('minPax', 'maxPax')
    });
  }

  // Holiday function
  createHoliday() {
    return this.fb.group({
      holidayName: new FormControl('', [Validators.required]),
      holidayDate: new FormControl('', [Validators.required]),
    });
  }

  addHoliday() {
    const currentReservationForm = this.reservationForm.getValue();
    const currentHolidays = currentReservationForm.controls.holidays as FormArray;
    currentHolidays.push(this.createHoliday());
    this.reservationForm.next(currentReservationForm);
  }

  deleteHoliday(i) {
    const currentReservationForm = this.reservationForm.getValue();
    const currentHolidays = currentReservationForm.controls.holidays as FormArray;
    currentHolidays.removeAt(i);
    this.reservationForm.next(currentReservationForm);
  }

  // Remark function
  createRemarkFormGroup() {
    return this.fb.group({
      remarkTitle: new FormControl('', [Validators.required]),
      remarkType: new FormControl('', [Validators.required]),
      remarkDetails: this.fb.array([this.createRemarkDetails()]),
    });
  }

  createRemarkDetails() {
    return this.fb.group({
      remarkName: new FormControl('', [Validators.required]),
    });
  }

  addRemarkParent() {
    const currentForm = this.reservationForm.getValue();
    const currentChildren = currentForm.controls.remarkManual as FormArray;
    currentChildren.push(this.createRemarkFormGroup());
    this.reservationForm.next(currentForm);
  }

  deleteRemarkParent(i) {
    const currentForm = this.reservationForm.getValue();
    const currentChildren = currentForm.controls.remarkManual as FormArray;
    currentChildren.removeAt(i);
    this.reservationForm.next(currentForm);
  }

  addRemarkChildren(i) {
    const currentForm = this.reservationForm.getValue();
    const currentChildren = (currentForm.controls.remarkManual as FormArray).at(i).get('remarkDetails') as FormArray;
    currentChildren.push(this.createRemarkDetails());
    this.reservationForm.next(currentForm);
  }

  deleteRemarkChildren(i, j) {
    const currentForm = this.reservationForm.getValue();
    const currentChildren = (currentForm.controls.remarkManual as FormArray).at(i).get('remarkDetails') as FormArray;
    currentChildren.removeAt(j);
    this.reservationForm.next(currentForm);
  }

  reservationValidationMessage() {
    const validation_messages = {
      'maxReservationDay': [
        { type: 'required', message: 'Max reservation day is required' },
      ],
      'minPax': [
        { type: 'required', message: 'Minimun pax is required' },
        { type: 'validPositiveNumber', message: 'Must be a positive number' },
        { type: 'validMaximum', message: 'Must be lower than 999' },
        { type: 'validPax', message: 'Must be lower than max pax' },
      ],
      'maxPax': [
        { type: 'required', message: 'Maximum pax is required' },
        { type: 'validPositiveNumber', message: 'Must be a positive number' },
        { type: 'validMaximum', message: 'Must be lower than 999' },
        { type: 'validPax', message: 'Must be higher than min pax' },
      ],
      'holidayName': [
        { type: 'required', message: 'Holiday name is required' },
      ],
      'holidayDate': [
        { type: 'required', message: 'Holiday date is required' },
      ],
      'remarkTitle': [
        { type: 'required', message: `Remark's title is required` },
      ],
      'remarkType': [
        { type: 'required', message: 'Type is required' },
      ],
      'remarkName': [
        { type: 'required', message: `Remark's name is required` },
      ],
    };
    return validation_messages;
  }

  // Function needed when submitting
  reservationSetter(form) {
    const fv = form.value;
    const reservation = {
      hasReservation: fv.reservationModel,
      maxReservationDay: fv.maxReservationDay,
      paxSettings: {
        minPax: fv.minPax,
        maxPax: fv.maxPax,
      },
      holidays: fv.holidays,
      remarkManual: fv.remarkManual
    };
    this.cleanObjects(fv, reservation);
    return reservation;
  }

  private cleanObjects(fv, obj) {
    if (!fv.holidayModel) {
      delete obj.holidays;
    }
    if (!fv.reservationModel) {
      delete obj.maxReservationDay;
      delete obj.paxSettings;
      delete obj.holidays;
    }
    if (!fv.hasDifferentRemark) {
      delete obj.remarkManual;
    }
  }
}
