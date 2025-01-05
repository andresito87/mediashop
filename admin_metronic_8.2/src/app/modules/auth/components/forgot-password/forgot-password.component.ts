import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  code: string;
  newPassword: string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        'andrespodadera87@gmail.com',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      code: ['', Validators.required],
      newPassword: ['', Validators.required],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;

    // Verificar si el código está presente
    if (this.f.code.value) {
      // Llamar al servicio para verificar el código
      const verifiedCodeSub = this.authService
        .verifyCode(this.f.email.value, this.f.code.value) // Usar el valor del formulario para el código
        .subscribe((result: any) => {
          this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
          // Si el código es verificado, proceder con el restablecimiento de la contraseña
          if (result.message === 'Code verified') {
            // Llamar al servicio para restablecer la contraseña
            this.authService
              .forgotPassword(
                this.f.email.value,
                this.f.code.value,
                this.f.newPassword.value
              ) // Usar los valores del formulario
              .subscribe(
                (result: boolean) => {
                  this.errorState = result
                    ? ErrorStates.NoError
                    : ErrorStates.HasError;
                  this.router.navigate(['/auth/login']);
                },
                (error) => {
                  console.error(error);
                }
              );
          }
        });

      if (verifiedCodeSub) {
        this.unsubscribe.push(verifiedCodeSub);
      }
    }

    // Llamada a forgotPassword sin verificar el código
    const forgotPasswordSubscr = this.authService
      .forgotPassword(
        this.f.email.value,
        this.f.code.value,
        this.f.newPassword.value
      ) // Usar los valores del formulario
      .pipe(first())
      .subscribe((result: boolean) => {
        this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
