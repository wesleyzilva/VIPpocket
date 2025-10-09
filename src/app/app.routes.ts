import { Routes } from '@angular/router';
import { Login } from './auth/login/login.component';
import { Register } from './auth/register/register.component';
import { Password } from './auth/register/password/password.component';
import { ForgotPassword } from './auth/forgot-password/forgot-password.component';
import { QrLoyalty } from './qr-card/qr-loyalty/qr-loyalty.component';
import { TermsComponent } from './auth/register/terms.component';



export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register/terms', component: TermsComponent },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'qr-loyalty', component: QrLoyalty },
  { path: 'register/password', component: Password },
];
