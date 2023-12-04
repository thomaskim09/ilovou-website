import { FormControl } from '@angular/forms';

export class AboveOneValidator {

  static validAboveOne(fc: FormControl) {
    if (fc.value < 1) {
      return ({ validAboveOne: true });
    } else {
      return (undefined);
    }
  }
}
