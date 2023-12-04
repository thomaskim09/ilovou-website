import { DashboardFeatureModule } from '../dashboard-feature.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VRGroupComponent } from './voucher-right/v-r-group/v-r-group.component';
import { VRLimitComponent } from './voucher-right/v-r-limit/v-r-limit.component';
import { VRMainContentComponent } from './voucher-right/v-r-main-content/v-r-main-content.component';
import { VRQuantityDetailsComponent } from './voucher-right/v-r-quantity-details/v-r-quantity-details.component';
import { VRRulesComponent } from './voucher-right/v-r-rules/v-r-rules.component';
import { VRSetDetailsComponent } from './voucher-right/v-r-set-details/v-r-set-details.component';
import { VoucherComponent } from './voucher.component';
import { VoucherLeftComponent } from './voucher-left/voucher-left.component';
import { VoucherRightComponent } from './voucher-right/voucher-right.component';
import { VoucherRightViewComponent } from './voucher-right-view/voucher-right-view.component';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { VRBranchComponent } from './voucher-right/v-r-branch/v-r-branch.component';
import { VRMonthlyDetailsComponent } from './voucher-right/v-r-monthly-details/v-r-monthly-details.component';

const routes: Routes = [
  { path: '', component: VoucherComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DashboardFeatureModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [
    VRGroupComponent,
    VRLimitComponent,
    VRMainContentComponent,
    VRBranchComponent,
    VRQuantityDetailsComponent,
    VRRulesComponent,
    VRSetDetailsComponent,
    VRMonthlyDetailsComponent,
    VoucherComponent,
    VoucherLeftComponent,
    VoucherRightComponent,
    VoucherRightViewComponent,
  ],
})
export class VoucherModule { }
