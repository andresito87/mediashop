import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchPassword(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;

    if (password !== confirmPassword) {
      control
        .get('password_confirmation')
        ?.setErrors({ ConfirmPassword: true });
    }
  }
}
