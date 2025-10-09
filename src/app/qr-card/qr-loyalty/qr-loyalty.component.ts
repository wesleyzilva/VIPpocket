import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-qr-loyalty',
  imports: [CommonModule],
  templateUrl: './qr-loyalty.component.html',
  styleUrl: './qr-loyalty.component.scss'
})
export class QrLoyalty {
  // Dados de exemplo
  user = {
    name: 'Cliente VIP',
    // O desconto disponível é 5% da última compra (R$ 45,00)
    availableDiscount: 2.25,
    // Soma de todos os 'discountGenerated' (2.00 + 1.50 + 2.50 + 2.25)
    totalDiscountAchieved: 8.25,
    stamps: [
      { day: 1, stamped: true, date: new Date('2025-10-05T12:30:00'), spentAmount: 40.0, discountGenerated: 2.0 },
      { day: 2, stamped: true, date: new Date('2025-10-06T12:45:00'), spentAmount: 30.0, discountGenerated: 1.5 },
      { day: 3, stamped: true, date: new Date('2025-10-07T13:00:00'), spentAmount: 50.0, discountGenerated: 2.5 },
      { day: 4, stamped: true, date: new Date('2025-10-08T12:15:00'), spentAmount: 45.0, discountGenerated: 2.25 },
      { day: 5, stamped: false, date: null, spentAmount: null, discountGenerated: null }
    ]
  };

  // O valor do QR Code (ex: ID do usuário, URL, etc.)
  // Você usará uma biblioteca para gerar o QR Code a partir deste valor.
  qrCodeValue = 'USER_ID_12345';

  get isCycleComplete(): boolean {
    return this.user.stamps.length === 5 && this.user.stamps.every(s => s.stamped);
  }

  get stampedDaysCount(): number {
    return this.user.stamps.filter(s => s.stamped).length;
  }
}
