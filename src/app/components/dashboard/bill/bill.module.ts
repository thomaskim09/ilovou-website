import { DashboardFeatureModule } from '../dashboard-feature.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillComponent } from './bill.component';
import { BillLeftComponent } from './bill-left/bill-left.component';
import { BillRightComponent } from './bill-right/bill-right.component';

const routes: Routes = [
  { path: '', component: BillComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DashboardFeatureModule
  ],
  declarations: [
    BillComponent,
    BillLeftComponent,
    BillRightComponent
  ],
})
export class BillModule { }
