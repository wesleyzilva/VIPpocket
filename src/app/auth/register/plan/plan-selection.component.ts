import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './plan-selection.component.html'
})
export class PlanSelectionComponent {
  constructor(private router: Router) {}

  selectPlan(plan: 'immediate' | 'cumulative'): void {
    console.log('Plano selecionado:', plan);
    this.router.navigate(['/register/user-info']);
  }
}