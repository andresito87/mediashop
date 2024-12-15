import { Component } from '@angular/core';
import { ProfileClientService } from '../service/profile-client.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit-profile-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-profile-client.component.html',
  styleUrl: './edit-profile-client.component.css',
})
export class EditProfileClientComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  biography: string = '';
  fbLink: string = '';
  twLink: string = '';
  gender: string = '';
  address_city: string = '';

  constructor(
    public profileClient: ProfileClientService,
    public toastr: ToastrService
  ) {
    this.profileClient.showUsers().subscribe((res: any) => {
      console.log(res);
      this.name = res.name;
      this.surname = res.surname;
      this.email = res.email;
      this.phone = res.phone;
      this.biography = res.biography;
      this.fbLink = res.fbLink;
      this.twLink = res.twLink;
      this.gender = res.gender;
      this.address_city = res.address_city;
    });
  }

  updateUser() {
    if (!this.name || !this.email) {
      this.toastr.error(
        'VAlidación',
        'Es necesario inngresar un nombre y un correo electrónico'
      );
      return;
    }
    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      phone: this.phone,
      biography: this.biography,
      fbLink: this.fbLink,
      twLink: this.twLink,
      gender: this.gender,
      address_city: this.address_city,
    };
    this.profileClient.updateProfile(data).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success('Éxito', res.body.message);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error('Validación', err.error.message);
      },
    });
  }
}
