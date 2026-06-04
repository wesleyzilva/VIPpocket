// Sess\u00e3o do cliente (apenas customerId no localStorage) — habilita "lembrar este device".
import { Injectable, computed, inject, signal } from '@angular/core';
import { LoyaltyStore } from './loyalty.store';
import { Customer } from './loyalty.types';

const SESSION_KEY = 'vippocket:client:session';

@Injectable({ providedIn: 'root' })
export class ClientSession {
  private readonly store = inject(LoyaltyStore);
  private readonly customerId = signal<string | null>(this.load());

  readonly current = computed<Customer | undefined>(() => {
    const id = this.customerId();
    if (!id) return undefined;
    // depende do signal db pra reagir a atualiza\u00e7\u00f5es vindas do adm
    return this.store.db().customers.find((c) => c.id === id);
  });

  isAuthenticated(): boolean {
    return !!this.current();
  }

  setCurrent(customerId: string): void {
    localStorage.setItem(SESSION_KEY, customerId);
    this.customerId.set(customerId);
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    this.customerId.set(null);
  }

  private load(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }
}
