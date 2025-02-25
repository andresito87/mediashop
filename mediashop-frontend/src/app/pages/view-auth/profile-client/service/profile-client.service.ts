import { Injectable } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { URL_SERVICIOS } from '../../../../config/config';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileClientService {
  constructor(public authService: AuthService, public http: HttpClient) {}

  getInfoProfileClient() {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/profile_client/';
    return this.http.get(URL, {
      headers: headersAdded,
      observe: 'response',
    });
  }

  updateProfile(data: any): Observable<HttpResponse<any>> {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/profile_client';
    return this.http
      .post(URL, data, {
        headers: headersAdded,
        observe: 'response',
      })
      .pipe(
        // Luego de la actualización, se llama al endpoint /me para obtener la info actualizada.
        switchMap(() => this.showUsers()),
        tap((userData: any) => {
          // Actualiza el localStorage y el AuthService con la info nueva.
          console.log(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          this.authService.user = userData;
          this.authService.currentUserSubject.next(userData);
        })
      );
  }

  showUsers() {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/profile_client/me';
    return this.http.get(URL, {
      headers: headersAdded,
    });
  }

  showOrders() {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/profile_client/orders';
    return this.http.get(URL, {
      headers: headersAdded,
    });
  }

  registerReview(data: any) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/reviews';
    return this.http.post(URL, data, {
      headers: headersAdded,
      observe: 'response',
    });
  }

  updateReview(review_id: string, data: any) {
    let headersAdded = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    let URL = URL_SERVICIOS + '/ecommerce/reviews/' + review_id;
    return this.http.put(URL, data, {
      headers: headersAdded,
      observe: 'response',
    });
  }
}
