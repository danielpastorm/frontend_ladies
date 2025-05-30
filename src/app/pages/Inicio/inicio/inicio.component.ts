import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button'
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [Button, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})


export class InicioComponent {


  constructor(private router: Router, private productService: ProductService) { }
  kits: any[] = [];
  productosCatalogo: any[] = [];


  url: string = environment.apiUrl;
  //imagenModelo: string = this.url + "uploads/resources/xiomi.png"
  imagenModelo: string = 'https://ladies-first.shop/' + "uploads/resources/xiomi.png"

  ngOnInit() {

    this.obtenerKits();
  }

  obtenerUrlImagen(id: number): string {
    const primeraImagen = this.kits.find(q => q.id == id).imagenes.split(';')[0]; 
    return `${this.url}uploads/kit_${id}/${primeraImagen}`;
  }




  obtenerKits() {
    this.productService.getKits().subscribe(data => {
      this.productosCatalogo = data;

      this.kits = this.productosCatalogo.map(kit => {
        const categorias = kit.categoriasJson ? JSON.parse(kit.categoriasJson).categorias : [];
        return {
          ...kit,
          imagenesArray: kit.imagenes?.split(';') || [],
          categorias
        };
      });

      console.log('Kits procesados:', this.kits);
    });
  }
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
      this.router.navigate(['/Kits'], { queryParams: { emergencia: true } });
    } else {
      this.router.navigate(['/Kits']);
    }
  }

  scrollToFuncionamiento() {
    const elemento = document.getElementById("como-funciona");
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }
  

}
