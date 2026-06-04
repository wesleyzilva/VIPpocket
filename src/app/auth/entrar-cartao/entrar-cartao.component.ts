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
import { LoyaltyStore, normalizePhone, resetSeed } from '../../shared/loyalty.store';

@Component({
  selector: 'app-entrar-cartao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="entrar">
      <header>
        <h1>Entrar no meu <span>VIPpocket</span></h1>
        <p class="hint">Use o mesmo WhatsApp do cadastro ou entre com Google.</p>
      </header>

      @if (googleAuth.enabled()) {
        <div class="google-block">
          <div #googleBtn></div>
          <div class="divider"><span>ou pelo WhatsApp</span></div>
        </div>
      }

      <label>WhatsApp cadastrado</label>
      <input
        type="tel"
        [ngModel]="phone"
        (input)="onPhoneInput($event)"
        placeholder="(11) 99999-8888"
        inputmode="numeric"
        maxlength="16"
      />

      @if (error()) {
        <p class="error">{{ error() }}</p>
      }

      <button type="button" class="primary" (click)="entrar()">Abrir meu cartão</button>

      <small class="hint-sub center">
        Ainda não tem cadastro?
        <a href="javascript:void(0)" (click)="goCadastrar()" class="link">criar agora</a>
      </small>

      <div class="demo-block">
        <div class="divider"><span>demo · entrar como</span></div>
        <div class="chips">
          @for (c of clientesDemo(); track c.id) {
            <button type="button" class="chip" (click)="entrarComoDemo(c.id)">
              {{ c.name }}
            </button>
          }
        </div>
        <label>Prestador no QR físico</label>
        <div class="chips">
          @for (p of prestadores(); track p.id) {
            <button
              type="button"
              class="chip"
              [class.active]="p.id === providerSig()"
              (click)="trocarPrestador(p.id)"
            >
              {{ p.name }}
            </button>
          }
        </div>
        <button type="button" class="reset" (click)="resetarDados()">↺ Resetar dados mock</button>
      </div>
    </section>
  `,
  styles: [
    `
      .entrar {
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
      .google-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .divider {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #444;
        line-height: 0.1em;
        margin: 1rem 0 0.5rem;
      }
      .divider span {
        background: #2c2c2c;
        padding: 0 0.75rem;
        color: #888;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .demo-block {
        margin-top: 1.5rem;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin: 0.4rem 0 0.8rem;
      }
      .chip {
        background: #1a1a1a;
        color: #d0d0d0;
        border: 1px solid #555;
        border-radius: 999px;
        padding: 0.35rem 0.8rem;
        font-size: 0.8rem;
        cursor: pointer;
      }
      .chip:hover {
        border-color: #d4af37;
        color: #d4af37;
      }
      .chip.active {
        background: #d4af37;
        color: #2c2c2c;
        border-color: #d4af37;
        font-weight: bold;
      }
      .reset {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: transparent;
        color: #888;
        border: 1px dashed #555;
        border-radius: 8px;
        font-size: 0.75rem;
        cursor: pointer;
      }
      .reset:hover {
        color: #ff6b6b;
        border-color: #ff6b6b;
      }
    `,
  ],
})
export class EntrarCartaoComponent implements AfterViewInit {
  private readonly store = inject(LoyaltyStore);
  private readonly session = inject(ClientSession);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly googleAuth = inject(GoogleAuthService);

  @ViewChild('googleBtn') googleBtnRef?: ElementRef<HTMLDivElement>;

  phone = '';
  error = signal('');

  readonly providerSig = signal<string>(
    this.route.snapshot.queryParamMap.get('provider') ?? 'prov-demo',
  );
  private get providerId() {
    return this.providerSig();
  }
  readonly clientesDemo = computed(() => this.store.db().customers);
  readonly prestadores = computed(() => this.store.listProviders());

  trocarPrestador(id: string): void {
    this.providerSig.set(id);
  }

  entrarComoDemo(customerId: string): void {
    this.error.set('');
    this.session.setCurrent(customerId);
    this.store.ensureCard(customerId, this.providerId);
    this.navegarParaCartao();
  }

  resetarDados(): void {
    resetSeed();
    this.session.logout();
    window.location.reload();
  }

  ngAfterViewInit(): void {
    if (!this.googleAuth.enabled() || !this.googleBtnRef) return;
    this.googleAuth.signIn(this.googleBtnRef.nativeElement).then(
      (profile) => this.loginComGoogle(profile),
      (e) =>
        this.error.set('Falha no login Google: ' + (e instanceof Error ? e.message : String(e))),
    );
  }

  onPhoneInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const digits = raw.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 10)
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    else if (digits.length > 6)
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    else if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else if (digits.length > 0) masked = `(${digits}`;
    this.phone = masked;
    (event.target as HTMLInputElement).value = masked;
  }

  entrar(): void {
    this.error.set('');
    const target = normalizePhone(this.phone);
    if (target.replace(/\D/g, '').length < 12) {
      this.error.set('Digite seu WhatsApp completo com DDD.');
      return;
    }
    const found = this.store.db().customers.find((c) => normalizePhone(c.phone) === target);
    if (!found) {
      this.error.set('Não encontramos um cadastro com esse WhatsApp. Crie seu cartão agora.');
      return;
    }
    this.session.setCurrent(found.id);
    this.store.ensureCard(found.id, this.providerId);
    this.navegarParaCartao();
  }

  private loginComGoogle(profile: GoogleProfile): void {
    const found = this.store
      .db()
      .customers.find(
        (c) =>
          (profile.sub && c.googleSub === profile.sub) ||
          (profile.email && c.email === profile.email),
      );
    if (!found) {
      this.error.set('Esta conta Google ainda não tem cartão. Crie seu cadastro.');
      return;
    }
    this.session.setCurrent(found.id);
    this.store.ensureCard(found.id, this.providerId);
    this.navegarParaCartao();
  }

  goCadastrar(): void {
    this.router
      .navigate(['/onboarding'], { queryParams: { provider: this.providerId } })
      .then((ok) => {
        if (!ok)
          window.location.href = `/onboarding?provider=${encodeURIComponent(this.providerId)}`;
      });
  }

  private navegarParaCartao(): void {
    const target = `/qr-loyalty?provider=${encodeURIComponent(this.providerId)}`;
    this.router
      .navigate(['/qr-loyalty'], { queryParams: { provider: this.providerId } })
      .then((ok) => {
        if (!ok) window.location.href = target;
      })
      .catch(() => (window.location.href = target));
  }
}
