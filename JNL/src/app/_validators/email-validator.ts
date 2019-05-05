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
