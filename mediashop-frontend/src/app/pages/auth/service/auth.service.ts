import { HttpClient } from '@angular/common/http';
import { afterNextRender, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = '';
  user: any;

  // BehaviorSubject para almacenar y emitir la info del usuario
  public currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(public http: HttpClient, public router: Router) {
    afterNextRender(() => {
      this.initAuth();
    });
  }

  initAuth() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token') ?? '';
      this.user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null;
      console.log('initAuth user:', this.user);
      this.currentUserSubject.next(this.user);
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
      this.user = res.user;
      this.token = res.access_token;
      // Actualiza el BehaviorSubject con el usuario
      this.currentUserSubject.next(this.user);
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
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login');
    setTimeout(() => {
      window.location.reload();
    }, 1);
  }
}
