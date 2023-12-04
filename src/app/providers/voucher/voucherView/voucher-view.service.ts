import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class VoucherViewService {

  // Used to view different voucher
  private messageSource = new BehaviorSubject('full');
  currentMessage = this.messageSource.asObservable();

  // Used to refresh voucher list
  private submitStatusSource = new BehaviorSubject(false);
  currentSubmitStatus = this.submitStatusSource.asObservable();

  // Voucher length information
  private currentVoucherLengthSubject: BehaviorSubject<any>;
  public currentVoucherLength: Observable<any>;

  constructor() {
    this.currentVoucherLengthSubject = new BehaviorSubject<any>('');
    this.currentVoucherLength = this.currentVoucherLengthSubject.asObservable();
  }

  public get getVoucherLengthValue(): any {
    return this.currentVoucherLengthSubject.value;
  }

  public setVoucherLengthValue(data) {
    this.currentVoucherLengthSubject.next(data);
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeSubmitStatus(message: boolean) {
    this.submitStatusSource.next(message);
  }
}
