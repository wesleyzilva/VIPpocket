import { Routes } from '@angular/router';
import { Login } from './auth/login/login.component';
import { PlanSelectionComponent } from './auth/register/plan/plan-selection.component';
import { Register } from './auth/register/user-info/user-info.component';
import { Password } from './auth/register/password-new/password-new.component';
import { ForgotPasswordComponent  } from './auth/forgot-password/forgot-password.component';
import { QrLoyalty } from './qr-card/qr-loyalty/qr-loyalty.component'; // Garante que a importação está correta
import { TermsComponent } from './auth/register/terms/terms.component'; // O caminho já estava correto



export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: PlanSelectionComponent },
  { path: 'register/user-info', component: Register },
  { path: 'register/terms', component: TermsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qr-loyalty', component: QrLoyalty }, // Garante que o componente correto está sendo usado
  { path: 'register/password', component: Password },
];
