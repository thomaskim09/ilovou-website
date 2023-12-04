import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { ProfileLeftComponent } from './profile-left/profile-left.component';
import { ProfileRightComponent } from './profile-right/profile-right.component';
import { DashboardFeatureModule } from '../dashboard-feature.module';

const routes: Routes = [
  { path: '', component: ProfileComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DashboardFeatureModule
  ],
  declarations: [
    ProfileComponent,
    ProfileLeftComponent,
    ProfileRightComponent,
  ],
})
export class ProfileModule { }
