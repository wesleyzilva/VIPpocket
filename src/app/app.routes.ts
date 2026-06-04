import { Routes } from '@angular/router';
import { EntrarCartaoComponent } from './auth/entrar-cartao/entrar-cartao.component';
import { Login } from './auth/login/login.component';
import { OnboardingComponent } from './auth/onboarding/onboarding.component';
import { PlanSelectionComponent } from './auth/register/plan/plan-selection.component';
import { Register } from './auth/register/user-info/user-info.component';
import { Password } from './auth/register/password-new/password-new.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { QrLoyalty } from './qr-card/qr-loyalty/qr-loyalty.component';
import { TermsComponent } from './auth/register/terms/terms.component';

/**
 * Redirect raiz: se cliente j\u00e1 cadastrou neste device vai direto ao cart\u00e3o;
 * caso contr\u00e1rio, mostra onboarding minimalista (nome + WhatsApp + LGPD).
 * Suporta deeplink ?provider=prov-xxx vindo do QR f\u00edsico da loja.
 */
function rootRedirect(): string {
  try {
    const hasSession = !!localStorage.getItem('vippocket:client:session');
    return hasSession ? '/qr-loyalty' : '/onboarding';
  } catch {
    return '/onboarding';
  }
}

export const routes: Routes = [
  { path: '', redirectTo: rootRedirect(), pathMatch: 'full' },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'entrar', component: EntrarCartaoComponent },
  { path: 'login', component: Login },
  { path: 'register', component: PlanSelectionComponent },
  { path: 'register/user-info', component: Register },
  { path: 'register/terms', component: TermsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qr-loyalty', component: QrLoyalty },
  { path: 'register/password', component: Password },
];
