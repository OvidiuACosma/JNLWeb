import { AbstractControl, ValidatorFn } from '@angular/forms';


export function ValidatorEmail(): ValidatorFn {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    return (control: AbstractControl): {[key: string]: boolean} | null => {
        if (!EMAIL_REGEXP.test(control.value)) {
        return { 'emailFormat': true };
        }
        return null;
    };
}

export function ValidatorEmailListOfMax3(): ValidatorFn {
  const EMAIL_LIST_REGEXP = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/i;
  return (control: AbstractControl): {[key: string]: boolean} | null => {
    if (!EMAIL_LIST_REGEXP.test(control.value)) {
      return { 'emailFormat': true };
    }
    if (control.value.match(/,/g)?.length > 2) {
      return{ 'emailsCount': true };
    }
    return null;
  };
}
