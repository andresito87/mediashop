import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { PermissionAuth } from './pages/auth/service/auth.guard';
import { provideServerRendering } from '@angular/platform-server';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
    provideHttpClient(withFetch()),
    provideClientHydration(
      withEventReplay() // use hydration with v18 event replay
    ),
    CookieService,
    PermissionAuth,
    provideServerRendering(),
  ],
};
