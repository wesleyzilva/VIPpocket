import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientSession } from '../../shared/client-session';
import { GoogleAuthService, GoogleProfile } from '../../shared/google-auth';
import { LoyaltyStore, normalizePhone } from '../../shared/loyalty.store';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="onboarding">
      <header>
        <h1>Bem-vindo ao <span>VIPpocket</span></h1>
        @if (provider(); as p) {
          <p class="provider">
            Cartão fidelidade de <strong>{{ p.name }}</strong> · a cada
            {{ p.ruleSize }} atendimentos: {{ p.bonusDescription }}
          </p>
        }
      </header>

      <p class="hint">Em 20 segundos você já está ganhando selos. Só precisamos do essencial:</p>

      @if (googleAuth.enabled()) {
        <div class="google-block">
          <div #googleBtn></div>
          <small class="hint-sub center">Acelera preenchendo nome e e-mail automaticamente.</small>
          <div class="divider"><span>ou cadastre manualmente</span></div>
        </div>
      }

      <label>Como podemos te chamar? <span class="req">*</span></label>
      <input
        type="text"
        [(ngModel)]="name"
        placeholder="Seu primeiro nome"
        maxlength="60"
        autocomplete="given-name"
      />

      <label>WhatsApp <span class="req">*</span></label>
      <input
        type="tel"
        [ngModel]="phone"
        (input)="onPhoneInput($event)"
        placeholder="(11) 99999-8888"
        autocomplete="tel"
        inputmode="numeric"
        maxlength="16"
      />
      <small class="hint-sub">Usamos para avisar quando seu bônus está disponível. Sem spam.</small>

      <label class="check">
        <input type="checkbox" [(ngModel)]="consentLgpd" />
        Concordo com o uso dos meus dados para o programa de fidelidade (<a
          href="javascript:void(0)"
          (click)="showLgpdDetail = !showLgpdDetail"
          >ver detalhes</a
        >).
      </label>
      @if (showLgpdDetail) {
        <small class="hint-sub box">
          Guardamos apenas seu nome e WhatsApp, usados exclusivamente para registrar selos e te
          avisar sobre bônus disponíveis. Você pode pedir exclusão a qualquer momento.
        </small>
      }

      <label class="check">
        <input type="checkbox" [(ngModel)]="consentMarketing" />
        Aceito receber promoções ocasionais (opcional)
      </label>

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <button type="button" class="primary" (click)="submit()">Começar a ganhar selos</button>
      @if (missing(); as m) {
        <small class="hint-sub center missing">{{ m }}</small>
      }
      <small class="hint-sub center">
        Já tem cartão?
        <a href="javascript:void(0)" (click)="goToCard()" class="link">abrir meu cartão</a>
      </small>
    </section>
  `,
  styles: [
    `
      .onboarding {
        max-width: 420px;
        margin: 1.5rem auto;
        padding: 2rem 1.5rem;
        background: #2c2c2c;
        border-radius: 16px;
        border: 1px solid #d4af37;
        color: #f0f0f0;
      }
      h1 {
        color: #f0f0f0;
        margin: 0 0 0.25rem;
        font-size: 1.5rem;
        font-weight: 500;
      }
      h1 span {
        color: #d4af37;
        font-weight: bold;
        letter-spacing: 1px;
      }
      .provider {
        color: #b0b0b0;
        margin: 0 0 1.25rem;
        font-size: 0.85rem;
        line-height: 1.4;
      }
      .provider strong {
        color: #d4af37;
      }
      .hint {
        color: #b0b0b0;
        margin: 0 0 1.25rem;
        font-size: 0.9rem;
      }
      label {
        display: block;
        margin: 0.85rem 0 0.25rem;
        font-size: 0.8rem;
        color: #d0d0d0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      label.check {
        text-transform: none;
        font-size: 0.85rem;
        color: #b0b0b0;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      label.check input {
        margin-top: 0.2rem;
      }
      label.check a {
        color: #d4af37;
        cursor: pointer;
      }
      .req {
        color: #ff6b6b;
      }
      input[type='text'],
      input[type='tel'] {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem;
        background: #1a1a1a;
        color: #f0f0f0;
        border: 1px solid #444;
        border-radius: 8px;
        font-size: 1rem;
      }
      input:focus {
        outline: none;
        border-color: #d4af37;
      }
      .hint-sub {
        display: block;
        color: #888;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      }
      .hint-sub.center {
        text-align: center;
        margin-top: 1rem;
      }
      .hint-sub.box {
        background: rgba(212, 175, 55, 0.08);
        padding: 0.5rem;
        border-radius: 6px;
        border-left: 3px solid #d4af37;
        line-height: 1.4;
      }
      .error {
        color: #ff6b6b;
        margin: 0.75rem 0 0;
        font-size: 0.85rem;
      }
      .link {
        color: #d4af37;
        cursor: pointer;
        text-decoration: underline;
      }
      button.primary {
        margin-top: 1.5rem;
        width: 100%;
        padding: 0.9rem;
        background: #d4af37;
        color: #2c2c2c;
        border: none;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        letter-spacing: 0.5px;
      }
      button.primary:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .hint-sub.missing {
        color: #ffb347;
        font-weight: 500;
      }
    `,
  ],
})
export class OnboardingComponent implements AfterViewInit {
  private readonly store = inject(LoyaltyStore);
  private readonly session = inject(ClientSession);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly googleAuth = inject(GoogleAuthService);

  @ViewChild('googleBtn') googleBtnRef?: ElementRef<HTMLDivElement>;

  name = '';
  phone = '';
  email = '';
  googleSub = '';
  pictureUrl = '';
  consentLgpd = false;
  consentMarketing = false;
  showLgpdDetail = false;
  error = signal('');

  private readonly providerId = this.route.snapshot.queryParamMap.get('provider') ?? 'prov-demo';
  provider = computed(() => this.store.getProvider(this.providerId));

  canSubmit(): boolean {
    return (
      this.name.trim().length >= 2 &&
      normalizePhone(this.phone).replace(/\D/g, '').length >= 12 &&
      this.consentLgpd
    );
  }

  /** Mensagem indicando o que falta preencher (ou vazio se tudo OK). */
  missing(): string {
    const faltas: string[] = [];
    if (this.name.trim().length < 2) faltas.push('nome');
    if (normalizePhone(this.phone).replace(/\D/g, '').length < 12) faltas.push('WhatsApp válido');
    if (!this.consentLgpd) faltas.push('aceite LGPD');
    return faltas.length ? `Falta preencher: ${faltas.join(', ')}.` : '';
  }

  /** Aplica máscara BR (XX) XXXXX-XXXX enquanto o usuário digita. */
  onPhoneInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 10) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      masked = `(${digits}`;
    }
    this.phone = masked;
    (event.target as HTMLInputElement).value = masked;
  }

  ngAfterViewInit(): void {
    if (!this.googleAuth.enabled() || !this.googleBtnRef) return;
    this.googleAuth.signIn(this.googleBtnRef.nativeElement).then(
      (profile) => this.applyGoogleProfile(profile),
      (e) =>
        this.error.set('Falha no login Google: ' + (e instanceof Error ? e.message : String(e))),
    );
  }

  private applyGoogleProfile(p: GoogleProfile): void {
    if (!this.name) this.name = p.name.split(' ')[0];
    this.email = p.email;
    this.googleSub = p.sub;
    if (p.picture) this.pictureUrl = p.picture;
  }

  submit(): void {
    console.log('[onboarding] submit clicked', {
      name: this.name,
      phone: this.phone,
      consentLgpd: this.consentLgpd,
      missing: this.missing(),
    });
    this.error.set('');
    const m = this.missing();
    if (m) {
      this.error.set(m);
      return;
    }
    try {
      const customer = this.store.addCustomer({
        name: this.name.trim(),
        phone: this.phone,
        email: this.email || undefined,
        googleSub: this.googleSub || undefined,
        pictureUrl: this.pictureUrl || undefined,
        consentLgpd: this.consentLgpd,
        consentMarketing: this.consentMarketing,
      });
      console.log('[onboarding] customer created', customer);
      this.session.setCurrent(customer.id);
      this.store.ensureCard(customer.id, this.providerId);
      const targetUrl = `/qr-loyalty?provider=${encodeURIComponent(this.providerId)}`;
      this.router
        .navigate(['/qr-loyalty'], { queryParams: { provider: this.providerId } })
        .then((ok) => {
          console.log('[onboarding] navigate result', ok);
          if (!ok) window.location.href = targetUrl;
        })
        .catch((err) => {
          console.error('[onboarding] navigate error', err);
          window.location.href = targetUrl;
        });
    } catch (e: unknown) {
      console.error('[onboarding] submit error', e);
      this.error.set(e instanceof Error ? e.message : String(e));
    }
  }

  goToCard(): void {
    console.log('[onboarding] goToCard clicked');
    this.router.navigate(['/entrar'], { queryParams: { provider: this.providerId } }).then((ok) => {
      if (!ok) {
        window.location.href = `/entrar?provider=${encodeURIComponent(this.providerId)}`;
      }
    });
  }
}
