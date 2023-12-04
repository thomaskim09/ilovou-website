import { FormControl } from '@angular/forms';

export class FoodTypeValidator {

  static validFoodType(fc: FormControl) {
    if (fc.value.length > 5) {
      return ({ validFoodType: true });
    } else {
      return (undefined);
    }
  }
}
