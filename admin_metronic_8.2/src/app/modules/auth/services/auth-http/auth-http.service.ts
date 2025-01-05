import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';

const API_USERS_URL = `${environment.URL_SERVICIOS}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
      email,
      password,
    });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    let data = {
      name: user.name,
      email: user.email,
      password: user.password,
      password_confirmation: user.password,
      type_user: 1,
    };

    console.log(data);

    return this.http.post<UserModel>(`${API_USERS_URL}/register`, data);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot_password`, {
      email,
    });
  }

  // Verify code
  verifyCode(email: string, code: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/verified_code`, {
      email,
      code,
    });
  }

  // Change password
  changePassword(email: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/update_password_admin`, {
      email,
      password,
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }
}
