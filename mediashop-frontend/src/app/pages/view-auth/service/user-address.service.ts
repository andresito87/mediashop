import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class UserAddressService {
  constructor(public authService: AuthService, public http: HttpClient) {}

  listAddress() {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/user_address/';

    return this.http.get(URL, { headers: headersAdded });
  }

  registerAddress(data: any) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/user_address';

    return this.http.post(URL, data, { headers: headersAdded });
  }

  updateAddress(address_id: string, data: any) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/user_address/' + address_id;

    return this.http.put(URL, data, {
      headers: headersAdded,
      observe: 'response',
    });
  }

  deleteAddress(address_id: string) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/user_address/' + address_id;

    return this.http.delete(URL, { headers: headersAdded });
  }
}
