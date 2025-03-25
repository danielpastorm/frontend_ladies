import { Component, OnInit, LOCALE_ID, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { last } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FechaPeriodo } from '../../Data/perfil.types';
import { PerfilServiceService } from '../../services/perfil-service.service';
import localeEs from '@angular/common/locales/es'; // ✅ Importa español


registerLocaleData("localeEs");

@Component({
  selector: 'app-registrarperiodo',
  imports: [CommonModule, ButtonModule, FormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './registrarperiodo.component.html',
  styleUrl: './registrarperiodo.component.css'
})


export class RegistrarperiodoComponent {
  shippingDate: string | null = null;
  date_string: string = "";

  fechas: FechaPeriodo = {
    IdUsuario: '',
    Fecha_Periodo: new Date(),
    FechaEnvio: new Date(),
    FechaEstimadaEntrega: new Date(),
    DiasPeriodo: 0
  };

  constructor (private profileService: PerfilServiceService) {}
  

  calculateShippingDate() {

    const lastPeriodInput = document.getElementById('last-period') as HTMLInputElement;
    const cycleLengthInput = document.getElementById('cycle-length') as HTMLInputElement;

    const lastPeriod = lastPeriodInput.value ? new Date(lastPeriodInput.value) : null;
    const cycleLength = cycleLengthInput.value ? parseInt(cycleLengthInput.value, 10) : null;

    if (!lastPeriod || !cycleLength || isNaN(cycleLength)) {
      alert('Por favor, ingresa todos los datos correctamente.');
      return;
    }

    // Calcular la fecha de envío (10 días antes del próximo periodo)

    // Clonar la fecha de último período
    const nextPeriod = new Date(lastPeriod);

    // Agregar un mes al último período
    nextPeriod.setMonth(nextPeriod.getMonth() + 1);

    // Restar el ciclo (cycleLength) si es necesario (ajústalo según el uso)
    nextPeriod.setDate(nextPeriod.getDate() - cycleLength);

    // Calcular la fecha de envío (10 días antes del próximo periodo)
    const shippingDate = new Date(nextPeriod);
    shippingDate.setDate(shippingDate.getDate() - 10);

    this.shippingDate = shippingDate.toLocaleDateString();

    this.fechas.IdUsuario = '0ea4e580-85b6-477e-ae26-c08f3805493f';
    this.fechas.FechaEstimadaEntrega = nextPeriod;

    this.fechas.FechaEnvio = shippingDate; 


    this.date_string = this.fechas.FechaEnvio.toISOString().split('T')[0];


    console.log("datos a enviar:", this.fechas);

    // this.profileService.RegistrarPeriodo(this.fechas).subscribe(() => {
    //   console.log("Producto agregado al carrito:", this.fechas);
    // }, error => {
    //   console.error("Error al agregar al carrito", error);
    // });

  }

  registrar(){
    this.profileService.RegistrarPeriodo(this.fechas).subscribe(() => {
      console.log("Producto agregado al carrito:", this.fechas);
    }, error => {
      console.error("Error al agregar al carrito", error);
    });
  }
}
