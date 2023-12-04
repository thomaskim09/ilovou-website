import { DashboardFeatureModule } from '../dashboard-feature.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { ReservationLeftComponent } from './reservation-left/reservation-left.component';

const routes: Routes = [
  { path: '', component: ReservationComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DashboardFeatureModule
  ],
  declarations: [
    ReservationComponent,
    ReservationLeftComponent,
  ],
})
export class ReservationModule { }
