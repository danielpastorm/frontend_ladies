import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.css'
})
export class SuscripcionComponent {
  suscripciones: any[] = [];

  constructor(private subscriptionService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // Supón que ya tienes el CustomerId del usuario logueado
    const customerId = 'cus_S4Ri5XycZW4nfj';
    this.subscriptionService.listSubscriptions(customerId).subscribe({
      next: data => {
        // Asumiendo que data.data es el array de suscripciones
        this.suscripciones = data;
        console.log("subs", this.suscripciones)
      },
      error: err => {
        console.error('Error al cargar suscripciones:', err);
      }
    });
  }

  cancelarSuscripcion(subscriptionId: string): void {
    this.subscriptionService.cancelSubscription(subscriptionId).subscribe({
      next: resp => {
        console.log('Suscripción cancelada:', resp);
        // Actualiza la lista o muestra un mensaje
      },
      error: err => {
        console.error('Error al cancelar la suscripción:', err);
      }
    });
  }

  redireccionarAKits(): void {
    // Redirige a la ruta de kits
    this.router.navigate(['/Kits']);
  }
}
