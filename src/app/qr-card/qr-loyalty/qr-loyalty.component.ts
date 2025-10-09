import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qr-loyalty',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-loyalty.component.html',
  styleUrl: './qr-loyalty.component.scss'
})
export class QrLoyalty implements OnInit {
  user: any;
  qrCodeValue = 'https://github.com/wesleyzilva/VIPpocket'; // Valor de exemplo para o QR Code
  isCycleComplete = false;
  stampedDaysCount = 0;

  constructor() { }

  ngOnInit(): void {
    // Dados de exemplo para teste
    this.user = {
      name: 'Wesley Zilva',
      totalDiscountAchieved: 18.75,
      availableDiscount: 3.00, // Desconto disponível após a sexta compra
      stamps: [
        { day: 1, stamped: true, date: new Date('2024-10-01T10:00:00'), spentAmount: 50.00, discountGenerated: 2.50 },
        { day: 2, stamped: true, date: new Date('2024-10-02T10:00:00'), spentAmount: 75.50, discountGenerated: 3.78 },
        { day: 3, stamped: true, date: new Date('2024-10-03T10:00:00'), spentAmount: 42.00, discountGenerated: 2.10 },
        { day: 4, stamped: true, date: new Date('2024-10-04T10:00:00'), spentAmount: 120.00, discountGenerated: 6.00 },
        { day: 5, stamped: true, date: new Date('2024-10-05T10:00:00'), spentAmount: 27.50, discountGenerated: 1.37 },
        { day: 6, stamped: true, date: new Date('2024-10-06T10:00:00'), spentAmount: 60.00, discountGenerated: 3.00 },
        { day: 7, stamped: false }
      ]
    };

    this.updateCardState();
  }

  updateCardState(): void {
    this.stampedDaysCount = this.user.stamps.filter((s: any) => s.stamped).length;
    this.isCycleComplete = this.stampedDaysCount === 7;
  }

  startNewCard(): void {
    // TODO: Idealmente, esta lógica viria de um serviço que busca um novo cartão da API.
    // Por enquanto, vamos simular a criação de um novo cartão zerado.

    // Mantém os dados do usuário, mas reseta o cartão.
    this.user.stamps = [
      { day: 1, stamped: false },
      { day: 2, stamped: false },
      { day: 3, stamped: false },
      { day: 4, stamped: false },
      { day: 5, stamped: false },
      { day: 6, stamped: false },
      { day: 7, stamped: false }
    ];
    this.user.availableDiscount = 0;
    this.updateCardState(); // Atualiza a interface para mostrar o novo cartão.
  }
}