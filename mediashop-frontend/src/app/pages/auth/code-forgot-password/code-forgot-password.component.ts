import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './code-forgot-password.component.html',
  styleUrl: './code-forgot-password.component.css',
})
export class CodeForgotPasswordComponent {
  code: string = '';
  isLoadingCode: any = false;

  @Output() LoadingCodeStatus: EventEmitter<any> = new EventEmitter();
  @Output() CodeValue: EventEmitter<any> = new EventEmitter();
  constructor(public authService: AuthService, public toastr: ToastrService) {}

  verifiedCode() {
    if (!this.code) {
      this.toastr.error(
        'Error',
        'Necesitas ingresar el código de verificación'
      );
      return;
    }

    const data = {
      code: this.code,
    };
    this.authService.verifiedCode(data).subscribe((res: any) => {
      if (res.error) {
        this.toastr.error('Error', 'Código no encontrado');
        this.isLoadingCode = null;
        this.LoadingCodeStatus.emit(null);
        return;
      }
      this.toastr.success(
        'Exito',
        'El código es correcto, ahora ingresa tu nueva contraseña'
      );
      this.isLoadingCode = 1;
      this.LoadingCodeStatus.emit(true);
      this.CodeValue.emit(this.code);
    });
  }
}
