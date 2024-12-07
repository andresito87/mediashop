import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { LandingProductComponent } from './pages/guest-view/landing-product/landing-product.component';
import { authGuard } from './pages/auth/service/auth.guard';
import { CartComponent } from './pages/view-auth/cart/cart.component';
import { CheckoutComponent } from './pages/view-auth/checkout/checkout.component';
import { ThankYouOrderComponent } from './pages/view-auth/thank-you-order/thank-you-order.component';
import { ProfileClientComponent } from './pages/view-auth/profile-client/profile-client.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    // canActivate: [authGuard], //protect it for unathenticated users
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'cambiar-credenciales',
    component: ForgotPasswordComponent,
  },
  {
    path: 'product/:slug',
    component: LandingProductComponent,
  },
  {
    canActivate: [authGuard], //protect it for unathenticated users
    path: 'shopping-cart',
    component: CartComponent,
  },
  {
    canActivate: [authGuard], //protect it for unathenticated users
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    canActivate: [authGuard], //protect it for unathenticated users
    path: 'thank-you-for-your-purchase/:orderId',
    component: ThankYouOrderComponent,
  },
  {
    canActivate: [authGuard], //protect it for unathenticated users
    path: 'profile',
    component: ProfileClientComponent,
  },
];
