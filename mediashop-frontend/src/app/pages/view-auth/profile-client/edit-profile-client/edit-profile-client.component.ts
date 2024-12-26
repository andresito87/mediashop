import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() imagePreviewChanged = new EventEmitter<string>();

  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  biography: string = '';
  fbLink: string = '';
  twLink: string = '';
  gender: string = '';
  address_city: string = '';

  image_preview: any;
  file_image: any;

  constructor(
    public profileClient: ProfileClientService,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.profileClient.showUsers().subscribe((res: any) => {
      this.name = res.name;
      this.surname = res.surname;
      this.email = res.email;
      this.phone = res.phone;
      this.biography = res.biography;
      this.fbLink = res.fbLink;
      this.twLink = res.twLink;
      this.gender = res.gender;
      this.address_city = res.address_city;
      this.image_preview = res.avatar;
    });
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      this.toastr.error('Validacion', 'El archivo no es una imagen');
      return;
    }

    this.file_image = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_image);
    reader.onloadend = () => {
      this.image_preview = reader.result;
      this.imagePreviewChanged.emit(this.image_preview);
    };
  }

  updateUser() {
    if (!this.name || !this.email) {
      this.toastr.error(
        'VAlidación',
        'Es necesario inngresar un nombre y un correo electrónico'
      );
      return;
    }

    let formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    if (this.phone) {
      formData.append('phone', this.phone);
    }
    if (this.biography) {
      formData.append('biography', this.biography);
    }
    if (this.fbLink) {
      formData.append('fbLink', this.fbLink);
    }
    if (this.twLink) {
      formData.append('twLink', this.twLink);
    }
    if (this.gender) {
      formData.append('gender', this.gender);
    }
    if (this.address_city) {
      formData.append('address_city', this.address_city);
    }
    if (this.file_image) {
      formData.append('file_image', this.file_image);
    }

    this.profileClient.updateProfile(formData).subscribe({
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
