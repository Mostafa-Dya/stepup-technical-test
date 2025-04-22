import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const now = new Date();
    const date = new Date(value);
    return date > now ? null : { futureDate: true };
  };
}
