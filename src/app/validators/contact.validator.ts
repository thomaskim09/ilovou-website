import { AbstractControl, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export class ContactValidator {

  static validCountryPhone = (): ValidatorFn => {

    return (phoneControl: AbstractControl): { [key: string]: boolean } => {

      if (phoneControl.value !== '') {
        try {

          const number = `${phoneControl.value}`;
          const phoneNumber = parsePhoneNumberFromString(number, 'MY');
          const isValidNumber = phoneNumber.isValid();

          if (isValidNumber && number.length <= 10) {
            return undefined;
          } else {
            return {
              validCountryPhone: true
            };
          }
        } catch (e) {
          return {
            validCountryPhone: true
          };
        }
      } else {
        return undefined;
      }
    };
  }
}
