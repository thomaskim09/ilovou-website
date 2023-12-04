import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public imageCompress: NgxImageCompressService,
    public logger: NGXLogger) { }

  findInvalidControls(form) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  compressImage(imageData, controls, isArray?, needClearer?) {
    const counter = 0;
    this.compressData(imageData, counter, controls, isArray, needClearer);
  }

  private compressData(data, counter, controls, isArray?, needClearer?) {
    const byteTarget = needClearer ? 20000 : 12000;
    const quanlity = needClearer ? 60 : 65;
    counter++;
    if (this.imageCompress.byteCount(data) > byteTarget && counter < 5) {
      this.imageCompress.compressFile(data, 1, 100, quanlity).then(result => {
        if (this.imageCompress.byteCount(result) > byteTarget && counter < 5) {
          this.compressData(result, counter, controls, isArray, needClearer);
        } else {
          return this.processResult(result, controls, isArray);
        }
      });
    } else {
      return this.processResult(data, controls, isArray);
    }
  }

  private processResult(data, controls, isArray?) {
    this.logger.info(this.imageCompress.byteCount(data));
    if (isArray) {
      const list = controls.value;
      list.push(data);
      controls.setValue(list);
    } else {
      controls.setValue(data);
    }
  }
}
