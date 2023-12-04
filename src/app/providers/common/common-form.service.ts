import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFormService {

  constructor() { }

  checkControl(form, validation, type) {
    return form.get(type).hasError(validation.type) && (form.get(type).dirty || form.get(type).touched);
  }
}
