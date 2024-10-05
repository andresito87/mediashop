import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.showSuccess();
    if (this.authService.token && this.authService.user) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 500);
      return;
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.error('Validacion', 'Necesitas ingresar todos los campos');
      return;
    }
    this.authService.login(this.email, this.password).subscribe(
      (res: any) => {
        console.log(res);
        if (res.error && res.error.error == 'Invalid credentials') {
          this.toastr.error('Error', 'Usuario o contraseña incorrectos');
          return;
        } else {
          this.toastr.success('Exito', '!!! Bienvenid@ a la tienda !!!');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 500);
          return;
        }
      },
      (error) => {
        this.toastr.error('Error', 'Error de conexión, intente más tarde');
      }
    );
  }

  showSuccess() {
    this.toastr.success('!!! Éxito !!!', 'Operación completada');
  }
}
