import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ReservationFormService } from 'src/app/providers/reservation/reservationForm/reservation-form.service';
import { ReservationService } from 'src/app/providers/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../providers/common/common-form.service';

// interface for select drop down
interface Tag {
  name: string;
  value: number;
}

@Component({
  selector: 'app-reservation-left',
  templateUrl: './reservation-left.component.html',
  styleUrls: ['./reservation-left.component.scss']
})
export class ReservationLeftComponent implements OnInit, OnDestroy, OnChanges {

  // form properties
  @Input('form') form: FormGroup;
  currentUser: any;
  restaurantId: string;

  // restaurant type select
  maxReserveDayFilterCtrl: FormControl = new FormControl();
  maxReserveDayOptions: Tag[] = [];
  filteredMaxReserveDay: ReplaySubject<Tag[]> = new ReplaySubject<Tag[]>(1);

  // For production error
  holidaysControls: any;

  // Validation
  validation_messages;

  // Controller
  isFormChanged: boolean = false;
  timer: any;
  timer2: any;
  needSpinner: boolean = false;

  // Controller
  typeList: any = [
    { name: 'Single Select', value: 'RB' },
    { name: 'Multiple Select', value: 'CB' }
  ];

  constructor(
    public reservationFormService: ReservationFormService,
    public reservationService: ReservationService,
    public authenticationService: AuthenticationService,
    public hintService: HintService,
    public toastr: ToastrService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.validation_messages = this.reservationFormService.reservationValidationMessage();
    this.currentUser = this.authenticationService.currentUserValue;
    this.restaurantId = this.currentUser.restaurantId;
    this.form.get('reservationModel').setValue(this.currentUser.hasReservation);
    this.setUpMaxReserveDay();
    this.setUpReservationSettings();
    this.onChanges();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  ngOnChanges() {
    if (this.form) {
      this.holidaysControls = this.form.get('holidays');
    }
  }

  private setUpMaxReserveDay() {
    this.maxReserveDayOptions = [
      { name: '1 day', value: 1 },
      { name: '2 days', value: 2 },
      { name: '3 days', value: 3 },
      { name: '7 days', value: 7 },
      { name: '14 days', value: 14 },
      { name: '1 month', value: 30 },
      { name: '2 months', value: 60 },
    ];
    this.filteredMaxReserveDay.next(this.maxReserveDayOptions.slice());
    this.maxReserveDayFilterCtrl.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.filteredMaxReserveDay.next(this.filterTag(this.maxReserveDayOptions, this.maxReserveDayFilterCtrl));
    });
  }

  private setUpReservationSettings() {
    if (!this.restaurantId) {
      this.timer = setTimeout(() => this.toastr.error('Need to create a restaurant first'));
      return;
    }
    if (!this.currentUser.hasReservation) {
      return;
    }
    this.reservationService.getReservationSettings(this.restaurantId).pipe(untilDestroyed(this)).subscribe(val => {
      const re = val.reservationSettings;
      if (!re.hasReservation) {
        return;
      }
      // Update user details
      this.currentUser.hasReservation = true;
      this.authenticationService.updateCurrentUser(this.currentUser);
      // Patch input
      this.enableAllInput();
      const query = {
        reservationModel: re.hasReservation,
        maxReservationDay: re.maxReservationDay,
        minPax: re.paxSettings.minPax,
        maxPax: re.paxSettings.maxPax,
        holidayModel: this.checkIfChecked(re.holidays, 'holidays'),
        holidays: re.holidays,
        hasDifferentRemark: this.checkIfChecked(re.remarkManual, 'remarkManual'),
        remarkManual: re.remarkManual
      };
      // Handle holidays
      for (let j = 1; j < re.holidays.length; j++) {
        this.reservationFormService.addHoliday();
      }
      // Handle custom remark
      for (let i = 1; i < re.remarkManual.length; i++) {
        this.addParent();
        for (let j = 1; j < re.remarkManual[i].remarkDetails.length; j++) {
          this.addChildren(i);
        }
      }
      this.form.patchValue(query, { emitEvent: false, onlySelf: true });
    });
  }

  private onChanges() {
    this.timer2 = setTimeout(() => {
      this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        this.isFormChanged = true;
      });
    }, 500);
    this.form.get('reservationModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.enableAllInput();
      } else {
        this.disabledAllInput();
      }
    });
    this.form.get('holidayModel').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('holidays').enable({ emitEvent: false });
      } else {
        this.form.get('holidays').disable({ emitEvent: false });
      }
    });
    this.form.get('hasDifferentRemark').valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        this.form.get('remarkManual').enable();
      } else {
        this.form.get('remarkManual').disable();
      }
    });
  }

  private enableAllInput() {
    this.form.get('maxReservationDay').enable({ emitEvent: false });
    this.form.get('minPax').enable({ emitEvent: false });
    this.form.get('maxPax').enable({ emitEvent: false });
    this.form.get('holidayModel').enable();
    this.form.get('hasDifferentRemark').enable();
  }

  private disabledAllInput() {
    this.form.get('maxReservationDay').disable({ emitEvent: false });
    this.form.get('minPax').disable({ emitEvent: false });
    this.form.get('maxPax').disable({ emitEvent: false });
    this.form.get('holidayModel').disable();
    this.form.get('holidays').disable({ emitEvent: false });
    this.form.get('hasDifferentRemark').disable();
    this.form.get('remarkManual').disable({ emitEvent: false });
  }

  private checkIfChecked(array, type) {
    if (array && array.length !== 0) {
      this.form.get(`${type}`).enable({ emitEvent: false });
      return true;
    } else {
      this.form.get(`${type}`).disable({ emitEvent: false });
      return false;
    }
  }

  addHolidayDetails() {
    this.reservationFormService.addHoliday();
  }

  deleteHolidayDetails(i) {
    this.reservationFormService.deleteHoliday(i);
  }

  updateReservationSettings() {
    const title = 'Confirm to update reservation\'s setting?';
    this.hintService.showModal(title, '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes' || !this.form.valid) {
        return;
      }
      if (!this.restaurantId) {
        this.toastr.error('Need to create a restaurant first');
        return;
      }
      this.needSpinner = true;
      this.authenticationService.checkAdminFeature(this.currentUser._id).pipe(untilDestroyed(this)).subscribe(val => {
        if (!val) {
          this.toastr.error('Please upgrade your package to access this feature');
          return;
        }
        const reservation = this.reservationFormService.reservationSetter(this.form);
        this.reservationService.updateReservationSettings(this.restaurantId, reservation).pipe(untilDestroyed(this)).subscribe(val2 => {
          // Update user settings
          this.currentUser.hasReservation = reservation.hasReservation;
          this.authenticationService.updateCurrentUser(this.currentUser);
          // Handle success
          this.needSpinner = false;
          this.toastr.success('Reservation Information Updated');
          this.isFormChanged = false;
        });
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

  addParent() {
    this.reservationFormService.addRemarkParent();
  }

  deleteParent(i) {
    this.reservationFormService.deleteRemarkParent(i);
  }

  addChildren(i) {
    this.reservationFormService.addRemarkChildren(i);
  }

  deleteChildren(i, j) {
    this.reservationFormService.deleteRemarkChildren(i, j);
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
