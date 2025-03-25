import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.css'
})
export class SuscripcionComponent {
  isSubscribed = false;
  selectedPlan: string = '';

  plans = [
    { id: 'basic', name: 'Plan Básico', price: 9.99 },
    { id: 'premium', name: 'Plan Premium', price: 19.99 },
  ];
  currentPlan = { name: '', id: '' };

  subscribe() {
    if (!this.selectedPlan) {
      alert('Selecciona un plan antes de suscribirte.');
      return;
    }
    this.isSubscribed = true;
    this.currentPlan = this.plans.find(plan => plan.id === this.selectedPlan) || { name: '', id: '' };
  }

  manageSubscription() {
    alert('Redirigiendo a la administración de suscripción...');
  }

  cancelSubscription() {
    this.isSubscribed = false;
    this.currentPlan = { name: '', id: '' };
    alert('Tu suscripción ha sido cancelada.');
  }
}
