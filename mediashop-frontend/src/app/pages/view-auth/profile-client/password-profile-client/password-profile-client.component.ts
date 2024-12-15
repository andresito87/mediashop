import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProfileClientService } from '../service/profile-client.service';

@Component({
  selector: 'app-password-profile-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './password-profile-client.component.html',
  styleUrl: './password-profile-client.component.css',
})
export class PasswordProfileClientComponent {
  password: string = '';
  confirm_password: string = '';

  constructor(
    public profileClient: ProfileClientService,
    public toastr: ToastrService
  ) {}

  updatePassword() {
    if (!this.password || !this.confirm_password) {
      this.toastr.error(
        'Validación',
        'Es necesario inngresar la contraseña y la confirmación'
      );
      return;
    }

    if (this.password != this.confirm_password) {
      this.toastr.error('Validación', 'Las constraseñas son diferentes');
      return;
    }

    let data = {
      password: this.password,
    };
    this.profileClient.updateProfile(data).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success('Éxito', res.body.message);
        }
      },
      error: (err: any) => {
        this.toastr.error('Validación', err.error.message);
      },
    });
  }
}
