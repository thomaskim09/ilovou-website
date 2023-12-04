import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationFormService } from 'src/app/providers/reservation/reservationForm/reservation-form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  // Form Properties
  form: FormGroup;

  constructor(public reservationFormService: ReservationFormService) { }

  ngOnInit() {
    this.setUpForm();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.reservationFormService.currentReservationForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }
}
