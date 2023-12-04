import { AlertModalComponent } from './components/dashboard/modals/alert-modal/alert-modal.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CacheModule } from 'ionic-cache';
import { CustomLyModule } from './core/ly.module';
import { CustomMaterialModule } from './core/material.module';
import { FacebookModule } from 'ngx-facebook';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageCropModalComponent } from './components/dashboard/modals/image-crop-modal/image-crop-modal.component';
import { JwtHelper } from 'angular2-jwt';
import { JwtInterceptor } from './interceptors/jwt-interceptor';
import { LY_THEME } from '@alyle/ui';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MinimaLight } from '@alyle/ui/themes/minima';
import { NgModule } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PrivacyModalComponent } from './components/home/modals/privacy-modal/privacy-modal.component';
import { RefundModalComponent } from './components/home/modals/refund-modal/refund-modal.component';
import { TermsModalComponent } from './components/home/modals/terms-modal/terms-modal.component';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/app/providers/environments/environment';
import { MAT_DATE_LOCALE } from '@angular/material';

const toastrConfig = {
  timeOut: 1500,
  preventDuplicates: true
};

const logConfig = {
  serverLoggingUrl: `${environment.url}/v1/logs`,
  level: environment.isProd ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG,
  serverLogLevel: NgxLoggerLevel.ERROR
};

const cacheConfig = { keyPrefix: 'Web ' };

@NgModule({
  declarations: [
    AlertModalComponent,
    AppComponent,
    ImageCropModalComponent,
    PrivacyModalComponent,
    RefundModalComponent,
    TermsModalComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CacheModule.forRoot(cacheConfig),
    CustomLyModule,
    CustomMaterialModule,
    FacebookModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    LoggerModule.forRoot(logConfig),
    ReactiveFormsModule,
    ToastrModule.forRoot(toastrConfig),
  ],
  entryComponents: [
    AlertModalComponent,
    ImageCropModalComponent,
    PrivacyModalComponent,
    RefundModalComponent,
    TermsModalComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-AU' }, // For datepicker format
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // For image picker UI
    JwtHelper,
    NgxImageCompressService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
