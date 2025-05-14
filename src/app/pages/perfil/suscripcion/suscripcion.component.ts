import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-suscripcion',
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './suscripcion.component.html',
  styleUrl: './suscripcion.component.css'
})
export class SuscripcionComponent {
  suscripciones: any[] = [];
  customerId: string = '';


  constructor(private subscriptionService: ProductService, private router: Router, private auth: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.obtenerSubscripciones();
  }

  cancelarSuscripcion(subscriptionId: string): void {
    this.subscriptionService.cancelSubscription(subscriptionId).subscribe({
      next: resp => {
        this.messageService.add({
          severity: 'success',
          summary: 'Cancelaste tu suscripción correctamente'
        });

        this.obtenerSubscripciones();
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cancelar tu suscripción',
          detail: 'Intenta nuevamente'
        });
      }
    });
  }

  obtenerSubscripciones() {
    this.auth.getCustomerIdStripe(localStorage.getItem("Id") ?? '').subscribe({
      next: data => {
        this.customerId = data;

        // ⚡ Ahora sí, después de tener el customerId, llamamos a listSubscriptions
        this.subscriptionService.listSubscriptions(this.customerId).subscribe({
          next: subsData => {
            this.suscripciones = subsData;
            console.log("subs", this.suscripciones);
          },
          error: err => {
            console.error('Error al cargar suscripciones:', err);
          }
        });

      },
      error: err => {
        console.error('Error al obtener CustomerId:', err);
      }
    });
  }


  redireccionarAKits(): void {
    // Redirige a la ruta de kits
    this.router.navigate(['/Kits']);
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Suscripción Activa';
      case 'canceled':
        return 'Suscripción Cancelada';
      default:
        return 'Estado desconocido';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'active';
      case 'canceled':
        return 'cancelled';
      default:
        return '';
    }
  }

}
