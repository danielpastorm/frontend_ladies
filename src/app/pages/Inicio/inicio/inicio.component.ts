import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
@Component({
  selector: 'app-inicio',
  imports: [Card, Button],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
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
}
