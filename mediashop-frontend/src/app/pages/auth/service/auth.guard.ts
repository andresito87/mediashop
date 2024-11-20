import { AuthService } from './auth.service';
import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// allow filter all authorized requests, only logued users are allowed
@Injectable()
export class PermissionAuth {
  constructor(public authService: AuthService, public router: Router) {}

  canActive(): boolean {
    if (!this.authService.user || !this.authService.token) {
      this.router.navigateByUrl('/login');
      return false;
    }

    // check the actual time is higher than token datetime expiration
    let token = this.authService.token;
    let expiration = JSON.parse(atob(token.split('.')[1])).exp;
    if (Math.floor(new Date().getTime() / 1000) > expiration) {
      this.authService.logout();
      return false;
    }

    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionAuth).canActive();
};
