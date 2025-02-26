import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.authService.token;

    if (!this.authService.user || !token) {
      this.authService.logout();
      return false;
    }

    // Verificar que el token esté en el formato correcto
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Token inválido o malformado.');
      this.authService.logout();
      return false;
    }

    try {
      const tokenPayload = JSON.parse(atob(tokenParts[1]));
      const expirationDate = tokenPayload.exp;

      if (Math.floor(Date.now() / 1000) >= expirationDate) {
        this.authService.logout();
        return false;
      }
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      this.authService.logout();
      return false;
    }

    return true;
  }
}
