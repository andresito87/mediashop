import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  phone: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.authService.token && this.authService.user) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
      return;
    }
  }

  register() {
    if (
      !this.name ||
      !this.surname ||
      !this.email ||
      !this.password ||
      !this.phone
    ) {
      this.toastr.error('Validación', 'Necesitas ingresar todos los campos');
      return;
    }

    const data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      phone: this.phone,
    };

    this.authService
      .register(data)
      .pipe(
        tap((res: any) => {
          // Verifica si la respuesta contiene errores de validación
          if (
            res.error &&
            res.error.status === 'error' &&
            res.error.message &&
            res.error.message.email
          ) {
            this.toastr.error('Error', 'El correo electrónico ya está en uso');
            this.router.navigate(['/register']);
            return;
          }

          if (
            res.error &&
            res.error.status === 'error' &&
            res.error.message &&
            res.error.message.password
          ) {
            this.toastr.error('Error', 'Revisa la contraseña');
            this.router.navigate(['/register']);
            return;
          }

          // Si no hay errores, muestra un mensaje de éxito y redirige
          this.toastr.success(
            'Éxito',
            'Ingresa a tu correo para activar tu cuenta'
          );
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        }),
        catchError((error) => {
          console.error('error', error);
          // Maneja otros errores, como problemas de conexión
          this.toastr.error('Error', 'Error de conexión, intente más tarde');
          this.router.navigate(['/register']);
          // Retorna un observable vacío para continuar con el flujo
          return of(null);
        })
      )
      .subscribe();
  }
}
