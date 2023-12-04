import { AmazingTimePickerModule } from 'amazing-time-picker';
import { AuthGuard } from 'src/app/providers/guards/auth.guard';
import { CommonModule } from '@angular/common';
import { CustomLyModule } from 'src/app/core/ly.module';
import { CustomMaterialModule } from 'src/app/core/material.module';
import { DashboardComponent } from './dashboard.component';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HintModule } from 'src/app/components/dashboard/hint/hint.module';
import { NgModule } from '@angular/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', component: DashboardComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
      { path: '', redirectTo: 'home', pathMatch: 'full', },
      { path: 'profile', loadChildren: '../../components/dashboard/profile/profile.module#ProfileModule', canActivate: [AuthGuard], data: { title: 'Profile' } },
      { path: 'voucher', loadChildren: '../../components/dashboard/voucher/voucher.module#VoucherModule', canActivate: [AuthGuard], data: { title: 'Voucher' } },
      { path: 'reservation', loadChildren: '../../components/dashboard/reservation/reservation.module#ReservationModule', canActivate: [AuthGuard], data: { title: 'Reservation' } },
      { path: 'menu', loadChildren: '../../components/dashboard/menu/menu.module#MenuModule', canActivate: [AuthGuard], data: { title: 'Menu' } },
      { path: 'bill', loadChildren: '../../components/dashboard/bill/bill.module#BillModule', canActivate: [AuthGuard], data: { title: 'Bill' } }
    ]
  }
];

@NgModule({
  imports: [
    AmazingTimePickerModule,
    CommonModule,
    CustomLyModule,
    CustomMaterialModule,
    DragulaModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    HintModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
