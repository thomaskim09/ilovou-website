import { FormControl } from '@angular/forms';

export class AboveZeroValidator {

  static validAboveZero(fc: FormControl) {
    if (fc.value < 1) {
      return ({ validAboveZero: true });
    } else {
      return (undefined);
    }
  }
}
