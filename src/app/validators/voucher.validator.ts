import { FormGroup, ValidatorFn, FormArray } from '@angular/forms';

export function validVoucher(newPrice: string, basePrice: string, groupModel: string, groupDetails: string): ValidatorFn {
  return (group: FormGroup): { [key: string]: any } => {
    const nPriceControl = group.controls[newPrice];
    const bPriceControl = group.controls[basePrice];
    const nPriceValue = nPriceControl.value;
    const bPriceValue = bPriceControl.value;
    checkGroupDetails(group, nPriceValue);
    if ((nPriceValue && bPriceValue) || nPriceValue === 0 || bPriceValue === 0) {
      if (nPriceValue >= bPriceValue) {
        nPriceControl.setErrors({ validVoucherPrice: true });
        bPriceControl.setErrors({ validVoucherPrice: true });
        return (undefined);
      } else if (nPriceValue > 0 && nPriceValue <= 1.01) {
        nPriceControl.setErrors({ validNewPriceRange: true });
        return (undefined);
      } else {
        nPriceControl.setErrors(priceCheckAll(nPriceValue));
        bPriceControl.setErrors(priceCheckAll(bPriceValue));
        return (undefined);
      }
    } else {
      nPriceControl.setErrors(priceCheckAll(nPriceValue));
      bPriceControl.setErrors(priceCheckAll(bPriceValue));
      return (undefined);
    }
  };

  function checkGroupDetails(group, nPriceValue) {
    const groupModelControl = group.controls[groupModel];
    const groupModelValue = groupModelControl.value;

    if (groupModelValue) {
      const groupDeControls = (group.controls[groupDetails] as FormArray).controls;
      const groupLength = groupDeControls.length;
      for (let i = 0; i < groupLength; ++i) {
        const groupUnitControl = groupDeControls[i].get('groupQuantity');
        const groupPriceControl = groupDeControls[i].get('groupPricePerUnit');
        const unitValue = groupUnitControl.value;
        const priceValue = groupPriceControl.value;
        let lastUnitValue = 0;
        let lastPriceValue;
        if (i > 0) {
          lastUnitValue = groupDeControls[i - 1].get('groupQuantity').value;
          lastPriceValue = groupDeControls[i - 1].get('groupPricePerUnit').value;
        }

        if ((nPriceValue && priceValue >= nPriceValue) || priceValue >= lastPriceValue) {
          groupPriceControl.setErrors({ validGroup: true });
        } else if (nPriceValue === 0) {
          groupPriceControl.setErrors({ validZero: true });
        } else if (priceValue > 0 && priceValue <= 1.50) {
          groupPriceControl.setErrors({ validNewPriceRange: true });
        } else {
          groupPriceControl.setErrors(groupPriceCheckAll(priceValue));
        }

        if (unitValue > 1 && unitValue > lastUnitValue) {
          groupUnitControl.setErrors(groupUnitCheckAll(unitValue));
        } else {
          groupUnitControl.setErrors({ validGroupUnit: true });
        }
      }
    }
  }

  function groupUnitCheckAll(value) {
    const required = checkRequired(value);
    const positive = checkPositive(value);
    if (required || positive) {
      return {
        validGroupUnit: false,
        required: required,
        validPositiveNumber: positive,
      };
    } else {
      return undefined;
    }
  }

  function groupPriceCheckAll(value) {
    const required = checkRequired(value);
    const positive = checkPositive(value);
    const decimal = checkDecimal(value);
    if (required || positive || decimal) {
      return {
        validZero: false,
        validGroup: false,
        validNewPriceRange: false,
        required: required,
        validPositiveNumber: positive,
        validDecimal: decimal
      };
    } else {
      return undefined;
    }
  }

  function priceCheckAll(value) {
    const required = checkRequired(value);
    const positive = checkPositive(value);
    const decimal = checkDecimal(value);
    if (required || positive || decimal) {
      return {
        required: required,
        validVoucherPrice: false,
        validNewPriceRange: false,
        validPositiveNumber: positive,
        validDecimal: decimal
      };
    } else {
      return undefined;
    }
  }

  function checkRequired(value) {
    return (value || value === 0) ? false : true;
  }

  function checkPositive(value) {
    return value < 0 ? true : false;
  }

  function checkDecimal(value) {
    return (/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(value) || value === 0) ? false : true;
  }
}
