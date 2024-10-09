import { Component, Input } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css',
})
export class NewPasswordComponent {
  new_password: string = '';
  isLoadingCode: any = false;
  @Input() code: any;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  verifiedNewPassword() {
    if (!this.new_password) {
      this.toastr.error(
        'Error',
        'Necesitas ingresar el código de verificación'
      );
      return;
    }

    const data = {
      new_password: this.new_password,
      code: this.code,
    };
    this.authService.verifiedNewPassword(data).subscribe((res: any) => {
      console.log(res);
      this.toastr.success(
        'Exito',
        'La contraseña se ha cambiado correctamente'
      );
      // recargar la pagina
      this.router.navigate(['/login']);
      setTimeout(() => {
        document.location.reload();
      }, 100);
    });
  }
}
