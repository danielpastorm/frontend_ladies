import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Producto } from '../../../Data/producto.types';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-comprar-productos',
  imports: [CardModule, ButtonModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './comprar-productos.component.html',
  styleUrl: './comprar-productos.component.css'
})
export class ComprarProductosComponent {
  products: any[] = []
  cargando: boolean = false;

  constructor(private productoService: ProductService, private auth: AuthService, private cartService: ProductService, private messageService: MessageService) {}

  ngOnInit() {
    this.cargando = true;
    this.fetchProducts();
  }

  fetchProducts() {
    this.productoService.getProductsMini()
      .then((data: Producto[]) => {
        this.products = data;
        this.cargando = false;
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        this.cargando = false;

      });
  }
  
  
  
  getFirstImage(images: string): string {
    if (!images) return ''; // Verifica que no sea undefined o vacío
    
    const firstImage = images.split(';')[0].trim(); // Obtiene la primera imagen y elimina espacios
    return decodeURIComponent(firstImage); // Decodifica caracteres especiales como %20
  }

  pagar(){
    console.log("pago");
    this.auth.pay(50).subscribe({
      next: (response) => console.log("Pago exitoso:", response),
      error: (error) => console.error("Error en el pago:", error)
    });
  }

  addToCart(product: any) {
    console.log(product);
    const cartItem = {
      userId: localStorage.getItem("Id"),
      Nombre: product.nombre,
      Descripcion: product.descripcion,
      productoId: product.id,
      kitId: null, // Es un producto, no un kit
      cantidad: 1, // Se puede modificar según la necesidad
      precioUnitario: product.precio
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: '¡Producto agregado correctamente!'
      });
    }, error => {
      this.messageService.add({
        severity: 'warn',
        summary: '¡Algo salio mal!',
        detail: 'Intenta nuevamente'
      });
    });
  }
  
}
