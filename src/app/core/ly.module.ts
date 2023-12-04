import { CommonModule } from '@angular/common';
import { LyButtonModule } from '@alyle/ui/button';
import { LyResizingCroppingImageModule } from '@alyle/ui/resizing-cropping-images';
import { LyThemeModule } from '@alyle/ui';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    LyThemeModule.setTheme('minima-light'),
    LyResizingCroppingImageModule,
    LyButtonModule,
  ],
  exports: [
    CommonModule,
    LyResizingCroppingImageModule,
    LyButtonModule,
  ],
  declarations: []
})
export class CustomLyModule { }
