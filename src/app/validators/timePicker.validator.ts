import { FormControl } from '@angular/forms';

export class TimePickerValidator {

  static validTimePicker(fc: FormControl) {
    if (fc.value === undefined || fc.value === '') {
      return ({ validTimePicker: true });
    } else {
      return (undefined);
    }
  }
}
