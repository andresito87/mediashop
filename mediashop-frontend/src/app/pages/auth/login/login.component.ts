import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  code_user: string = '';
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.authService.token && this.authService.user) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
      return;
    }
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params.code) {
        this.code_user = params.code;
      }
    });

    if (this.code_user) {
      const data: any = {
        code: this.code_user,
      };
      this.authService.verifiedAuth(data).subscribe((res: any) => {
        if (res.message == 'User not found') {
          this.toastr.error('Error', 'Error de conexión, intente más tarde');
          return;
        }
        this.toastr.success(
          'Exito',
          '!!! Correo verificado, ingrese a la tienda !!!'
        );
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
      });
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.error('Validacion', 'Necesitas ingresar todos los campos');
      return;
    }

    this.authService
      .login(this.email, this.password)
      .pipe(
        tap((res: any) => {
          if (res.error && res.error.error == 'Invalid credentials') {
            this.toastr.error('Error', 'Usuario o contraseña incorrectos');
            return;
          } else {
            this.toastr.success('Exito', '!!! Bienvenid@ a la tienda !!!');
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 500);
          }
        }),
        catchError((error) => {
          this.toastr.error('Error', 'Error de conexión, intente más tarde');
          // Return empty observable to complete the flow of observable
          return of(null);
        })
      )
      .subscribe();
  }

  sendToRegister(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/register']);
    // Reload JQuery code
    setTimeout(() => {
      document.location.reload();
    }, 100);
  }
}
