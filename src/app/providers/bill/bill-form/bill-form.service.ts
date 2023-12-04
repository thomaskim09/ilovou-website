import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BillFormService {

  private billForm: BehaviorSubject<FormGroup | undefined> = new BehaviorSubject(this.createFormGroup());
  currentBillForm = this.billForm.asObservable();

  constructor(public fb: FormBuilder) { }

  createFormGroup() {
    return this.fb.group({
      duration: new FormControl(''),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
    });
  }

  billValidationMessage() {
    const validation_messages = {
      'startDate': [
        { type: 'required', message: 'Start date is required' },
      ],
      'endDate': [
        { type: 'required', message: 'End date is required' },
      ]
    };
    return validation_messages;
  }
}
