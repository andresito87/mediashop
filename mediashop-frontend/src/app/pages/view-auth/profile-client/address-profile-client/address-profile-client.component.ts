import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserAddressService } from '../../service/user-address.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-address-profile-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address-profile-client.component.html',
  styleUrl: './address-profile-client.component.css',
})
export class AddressProfileClientComponent {
  addresses: any = [];

  name: string = '';
  surname: string = '';
  company: string = '';
  country_region: string = '';
  city: string = '';
  street_address: string = '';
  postcode_zip: string = '';
  phone: string = '';
  email: string = '';

  address_selected: any;

  constructor(
    public addressService: UserAddressService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addressService.listAddress().subscribe((res: any) => {
      this.addresses = res.addresses;
    });
  }

  registerAddress() {
    if (
      !this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.street_address ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email
    ) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      street_address: this.street_address,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };

    this.addressService.registerAddress(data).subscribe((res: any) => {
      this.addresses.unshift(res.address);
      this.toastr.success('Éxito', 'Dirección registrada correctamente');
      this.resetAddress();
    });
  }

  editAddress() {
    if (
      !this.name ||
      !this.surname ||
      !this.company ||
      !this.country_region ||
      !this.city ||
      !this.street_address ||
      !this.postcode_zip ||
      !this.phone ||
      !this.email
    ) {
      this.toastr.error('Validación', 'Todos los campos son requeridos');
      return;
    }

    let data = {
      name: this.name,
      surname: this.surname,
      company: this.company,
      country_region: this.country_region,
      city: this.city,
      street_address: this.street_address,
      postcode_zip: this.postcode_zip,
      phone: this.phone,
      email: this.email,
    };

    this.addressService
      .updateAddress(this.address_selected.id, data)
      .subscribe((res: any) => {
        let index = this.addresses.findIndex((item: any) => {
          console.log(res);
          return item.id == res.body.address.id;
        });
        console.log('index', index);
        if (index != -1) {
          this.addresses[index] = res.body.address;
        }

        this.toastr.success('Éxito', 'Dirección actualizada correctamente');
      });
  }

  selectedAddress(address: any) {
    this.address_selected = address;
    this.name = this.address_selected.name;
    this.surname = this.address_selected.surname;
    this.company = this.address_selected.company;
    this.country_region = this.address_selected.country_region;
    this.city = this.address_selected.city;
    this.street_address = this.address_selected.street_address;
    this.postcode_zip = this.address_selected.postcode_zip;
    this.phone = this.address_selected.phone;
    this.email = this.address_selected.email;
  }

  resetAddress() {
    this.address_selected = null;
    this.name = '';
    this.surname = '';
    this.company = '';
    this.country_region = '';
    this.city = '';
    this.street_address = '';
    this.postcode_zip = '';
    this.phone = '';
    this.email = '';
  }
}
