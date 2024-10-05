import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.user || !this.authService.token) {
      this.authService.logout();
      return false;
    }

    const token = this.authService.token;
    const expirationDate = JSON.parse(atob(token.split('.')[1])).exp;
    if (Math.floor(Date.now() / 1000) >= expirationDate) {
      this.authService.logout();
      return false;
    }
    return true;
  }
}
