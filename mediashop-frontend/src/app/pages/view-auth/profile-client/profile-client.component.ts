import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EditProfileClientComponent } from './edit-profile-client/edit-profile-client.component';
import { AddressProfileClientComponent } from './address-profile-client/address-profile-client.component';
import { OrdersProfileClientComponent } from './orders-profile-client/orders-profile-client.component';
import { PasswordProfileClientComponent } from './password-profile-client/password-profile-client.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { ProfileClientService } from './service/profile-client.service';

@Component({
  selector: 'app-profile-client',
  standalone: true,
  imports: [
    EditProfileClientComponent,
    AddressProfileClientComponent,
    OrdersProfileClientComponent,
    PasswordProfileClientComponent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css'],
})
export class ProfileClientComponent implements OnInit {
  selectedTab: number = 0;
  avatar: string = '';
  name: string = '';

  constructor(
    public authService: AuthService,
    public profileClient: ProfileClientService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // En vez de llamar a showUsers directamente, nos suscribimos al observable del AuthService
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        this.avatar = user.avatar;
        // Combina el nombre y apellido según lo que devuelva el backend
        this.name = user.name + ' ' + user.surname;
      }
      this.cdRef.detectChanges();
    });
  }

  selectTab(value: number) {
    this.selectedTab = value;
    this.cdRef.detectChanges();
  }

  logout() {
    this.authService.logout();
  }

  onImagePreviewChanged(newImage: string) {
    this.avatar = newImage;
  }
}
