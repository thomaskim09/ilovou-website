import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from 'src/app/core/material.module';
import { DragulaModule } from 'ng2-dragula';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HintModule } from './hint/hint.module';
import { NgModule } from '@angular/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    AmazingTimePickerModule,
    CommonModule,
    CustomMaterialModule,
    DragulaModule,
    FlexLayoutModule,
    FormsModule,
    HintModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
  ],
  exports: [
    AmazingTimePickerModule,
    CommonModule,
    CustomMaterialModule,
    DragulaModule,
    FlexLayoutModule,
    FormsModule,
    HintModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
  ]
})
export class DashboardFeatureModule { }
