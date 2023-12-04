import { FormControl } from '@angular/forms';

export class PositiveNumberValidator {

  static validPositiveNumber(fc: FormControl) {
    if (fc.value < 0) {
      return ({ validPositiveNumber: true });
    } else {
      return (undefined);
    }
  }
}
