import { FormGroup, ValidatorFn } from '@angular/forms';

export function validPax(minPax: string, maxPax: string): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } => {
    const minPaxControl = group.controls[minPax];
    const maxPaxControl = group.controls[maxPax];
    const minPaxValue = minPaxControl.value;
    const maxPaxValue = maxPaxControl.value;
    if (minPaxValue && maxPaxValue || minPaxValue === 0 || maxPaxValue === 0) {
      if (minPaxValue >= maxPaxValue) {
        minPaxControl.setErrors({ validPax: true });
        maxPaxControl.setErrors({ validPax: true });
        return (undefined);
      } else {
        minPaxControl.setErrors(paxCheckAll(minPaxValue));
        maxPaxControl.setErrors(paxCheckAll(maxPaxValue));
        return (undefined);
      }
    }
  };

  function paxCheckAll(value) {
    const required = checkRequired(value);
    const positive = checkPositive(value);
    const maximum = checkMaximum(value);
    if (required || positive || maximum) {
      return {
        required: required,
        validPositiveNumber: positive,
        validMaximum: maximum,
        validPax: false
      };
    } else {
      return undefined;
    }
  }

  function checkRequired(value) {
    return (value || value === 0) ? false : true;
  }

  function checkPositive(value) {
    return value <= 0 ? true : false;
  }

  function checkMaximum(value) {
    return value >= 999 ? true : false;
  }
}
