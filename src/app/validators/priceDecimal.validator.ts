import { FormControl } from '@angular/forms';

export class PriceDecimalValidator {

  static validDecimal(fc: FormControl) {
    if (fc.value || fc.value === 0) {
      if (/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(fc.value) || fc.value === 0) {
        return (undefined);
      } else {
        return ({ validDecimal: true });
      }
    }
  }
}
