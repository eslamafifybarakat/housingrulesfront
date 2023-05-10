import { AbstractControl } from '@angular/forms';
export class ConfirmPasswordValidator {

  // Check matching password with confirm password
  // @param control AbstractControl

  static MatchPassword(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ ConfirmPassword: true });
    }
  }
}
