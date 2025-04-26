import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button'
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [Button],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(private router: Router) { }

  // Acción al hacer clic en "Regístrate y arma tu kit"
  irARegistro() {
    // Aquí podrías navegar a la página de registro
    // this.router.navigate(['/registro']);
    alert('Ir a la página de registro');
  }

  // Acción al hacer clic en el botón de emergencia (SOS)
  botonEmergencia() {
    // Lógica de emergencia
    alert('Botón de emergencia presionado');
  }

  goToKits(emergencia: boolean = false) {
    if (emergencia) {
      this.router.navigate(['/comprar-productos'], { queryParams: { emergencia: true } });
    } else {
      this.router.navigate(['/comprar-productos']);
    }
  }

}
