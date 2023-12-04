import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { LoginComponent } from '../login/login.component';
import { MainNavComponent } from 'src/app/components/home/main-nav/main-nav.component';
import { PageAboutComponent } from 'src/app/components/home/page-about/page-about.component';
import { PageContactComponent } from 'src/app/components/home/page-contact/page-contact.component';
import { PageCtaComponent } from 'src/app/components/home/page-cta/page-cta.component';
import { PageDownloadComponent } from 'src/app/components/home/page-download/page-download.component';
import { PageFeaturesComponent } from 'src/app/components/home/page-features/page-features.component';
import { PageFooterComponent } from 'src/app/components/home/page-footer/page-footer.component';
import { PageHeaderComponent } from 'src/app/components/home/page-header/page-header.component';
import { SlideshowModule } from 'ng-simple-slideshow';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from 'src/app/core/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginGuard } from 'src/app/providers/guards/login.guard';
import { NgxCaptchaModule } from 'ngx-captcha';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SlideshowModule,
    NgxCaptchaModule,
  ],
  declarations: [
    HomeComponent,
    LoginComponent,
    MainNavComponent,
    PageAboutComponent,
    PageContactComponent,
    PageCtaComponent,
    PageDownloadComponent,
    PageFeaturesComponent,
    PageFooterComponent,
    PageHeaderComponent,
  ]
})
export class HomeModule { }
