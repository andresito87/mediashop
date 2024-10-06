import { Component } from '@angular/core';
import { CodeForgotPasswordComponent } from '../code-forgot-password/code-forgot-password.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CodeForgotPasswordComponent,
    NewPasswordComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  isLoadingMail: any = null;
  isLoadingCode: any = null;

  email: string = '';
  code: string = '';
  new_password: string = '';

  constructor(public authService: AuthService, public toastr: ToastrService) {}

  verifiedMail() {
    if (!this.email) {
      this.toastr.error('Error', 'Necesitas ingresar un correo');
      return;
    }

    const data = {
      email: this.email,
    };
    this.authService.verifiedEmail(data).subscribe((res: any) => {
      if (res.error) {
        this.toastr.error('Error', 'Correo no encontrado');
        this.isLoadingMail = false;
        return;
      }
      this.toastr.success('Exito', 'Consulta tu correo');
      this.isLoadingMail = true;
    });
  }

  LoadingCode(event: any) {
    this.isLoadingCode = event;
  }
}
