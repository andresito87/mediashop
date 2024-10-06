import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = '';
  user: any;
  constructor(public http: HttpClient, public router: Router) {
    this.initAuth();
  }

  initAuth() {
    if (localStorage.getItem('token')) {
      this.user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') ?? '')
        : null;
      this.token = localStorage.getItem('token') ?? '';
    }
  }

  login(email: string, password: string) {
    const URL = URL_SERVICIOS + '/auth/login';
    return this.http.post(URL, { email, password }).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  saveLocalStorage(res: any) {
    if (res && res.access_token) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return true;
    }
    return false;
  }

  register(data: any) {
    const URL = URL_SERVICIOS + '/auth/register';
    return this.http.post(URL, data).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  verifiedAuth(data: any) {
    const URL = URL_SERVICIOS + '/auth/verified_auth';
    return this.http.post(URL, data).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  verifiedEmail(data: any) {
    const URL = URL_SERVICIOS + '/auth/verified_email';
    return this.http.post(URL, data).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  verifiedCode(data: any) {
    const URL = URL_SERVICIOS + '/auth/verified_code';
    return this.http.post(URL, data).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  verifiedNewPassword(data: any) {
    const URL = URL_SERVICIOS + '/auth/verified_password';
    return this.http.post(URL, data).pipe(
      map((res: any) => {
        return this.saveLocalStorage(res);
      }),
      catchError((error: any) => {
        return of(error);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.token = '';
    this.user = null;
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 500);
  }
}
