import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientSession } from '../../shared/client-session';
import { LoyaltyStore } from '../../shared/loyalty.store';
import { LoyaltyCard, Provider, QrPayload } from '../../shared/loyalty.types';

@Component({
  selector: 'app-qr-loyalty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-loyalty.component.html',
  styleUrl: './qr-loyalty.component.scss',
})
export class QrLoyalty implements OnInit {
  private readonly store = inject(LoyaltyStore);
  private readonly session = inject(ClientSession);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly providerId = this.route.snapshot.queryParamMap.get('provider') ?? 'prov-demo';

  card = signal<LoyaltyCard | undefined>(undefined);
  provider = signal<Provider | undefined>(undefined);

  stampedCount = computed(() => this.card()?.stamps.filter((s) => s.stamped).length ?? 0);
  isCycleComplete = computed(() => {
    const c = this.card();
    return !!c && c.stamps.every((s) => s.stamped);
  });
  qrCodeValue = computed(() => {
    // QR perene do CLIENTE (v2) — não muda entre ciclos ou prestadores.
    // O prestador escaneia e o sistema descobre o cartão ativo no provider logado.
    const customer = this.session.current();
    if (!customer) return '';
    const payload: QrPayload = this.store.buildCustomerQrPayload(customer.id);
    return JSON.stringify(payload);
  });
  qrImageUrl = computed(() => {
    const data = this.qrCodeValue();
    if (!data) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(data)}`;
  });
  customerName = computed(() => this.session.current()?.name ?? 'VIP');
  remainingStamps = computed(() => {
    const c = this.card();
    if (!c) return 0;
    return c.ruleSize - this.stampedCount();
  });

  ngOnInit(): void {
    if (!this.session.isAuthenticated()) {
      this.router.navigate(['/onboarding'], {
        queryParams: { provider: this.providerId },
      });
      return;
    }
    this.refresh();
    window.addEventListener('storage', () => this.refresh());
  }

  private refresh(): void {
    const customer = this.session.current();
    if (!customer) return;
    this.provider.set(this.store.getProvider(this.providerId));
    const active = this.store.ensureCard(customer.id, this.providerId);
    this.card.set(active);
  }

  redeemBonus(): void {
    const c = this.card();
    if (!c) return;
    this.store.redeemBonus(c.id);
    this.refresh();
  }

  startNewCard(): void {
    const c = this.card();
    if (c && !c.bonusRedeemed) this.store.redeemBonus(c.id);
    this.refresh();
  }
}
