import { DashboardFeatureModule } from '../dashboard-feature.module';
import { MLFoodComponent } from './menu-left/m-l-food/m-l-food.component';
import { MLRemarkComponent } from './menu-left/m-l-remark/m-l-remark.component';
import { MLSettingComponent } from './menu-left/m-l-setting/m-l-setting.component';
import { MRCategoryComponent } from './menu-right/m-r-category/m-r-category.component';
import { MRFoodComponent } from './menu-right/m-r-food/m-r-food.component';
import { MRRemarkComponent } from './menu-right/m-r-remark/m-r-remark.component';
import { MenuComponent } from './menu.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MenuComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DashboardFeatureModule
  ],
  declarations: [
    MLFoodComponent,
    MLRemarkComponent,
    MLSettingComponent,
    MRCategoryComponent,
    MRFoodComponent,
    MRRemarkComponent,
    MenuComponent,
    MenuLeftComponent,
    MenuRightComponent,
  ],
})
export class MenuModule { }
