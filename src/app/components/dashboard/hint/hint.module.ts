import { NgModule } from '@angular/core';
import { HintComponent } from './hint.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    HintComponent
  ],
  exports: [
    HintComponent
  ],
})
export class HintModule { }
