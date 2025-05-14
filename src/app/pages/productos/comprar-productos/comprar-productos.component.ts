import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Producto } from '../../../Data/producto.types';
import { AuthService } from '../../../services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GalleriaModule } from 'primeng/galleria';

import { Message } from 'primeng/message';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FloatLabelStyle } from 'primeng/floatlabel';

@Component({
  selector: 'app-comprar-productos',
  imports: [CardModule, ButtonModule, CommonModule, ProgressSpinnerModule, GalleriaModule, Message, ConfirmDialog, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './comprar-productos.component.html',
  styleUrl: './comprar-productos.component.css'
})

export class ComprarProductosComponent {
  products: any[] = []
  cargando: boolean = false;
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  url: string = environment.apiUrl;


  emergencia: boolean = false;

  constructor(private productoService: ProductService, private auth: AuthService, private cartService: ProductService, private messageService: MessageService, private route: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) {
    this.route.queryParams.subscribe(params => {
      this.emergencia = params['emergencia'] === 'true' || false;

    })
  }

  ngOnInit() {
    this.cargando = true;
    this.fetchProducts();
    if (this.emergencia) {
      this.confirm();
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Estas Realizando una compra de emergenia, tus productos serán enviados con prioridad en un plazo de 2 a 3 días hábiles, y se aplicará un cargo adicional de $149MXN por el servicio express',
      message: 'Aceptas seguir en servicio de emergencia o cambiar a normal?.',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Si es emergencia' });
        this.emergencia = true;
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Se cancelo', detail: 'Falsa alarma' });
        this.emergencia = false;
      },
    });
  }

  fetchProducts() {
    this.productoService.getProductsMini()
      .then((data: Producto[]) => {
        this.products = data.filter(q => q.disponible === true);
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

  pagar() {
    console.log("pago");
    this.auth.pay(50).subscribe({
      next: (response) => console.log("Pago exitoso:", response),
      error: (error) => console.error("Error en el pago:", error)
    });
  }

  addToCart(product: any) {
    console.log(product);

    if (this.emergencia) {
      const cartItem = {
        userId: localStorage.getItem("Id"),
        Nombre: "cargo envio",
        Descripcion: "cargo emergencia",
        productoId: 5,
        kitId: null, // Es un producto, no un kit
        cantidad: 1, // Se puede modificar según la necesidad
        precioUnitario: 100
      };
      console.log("emergencia", cartItem)
      this.cartService.addToCart(cartItem).subscribe({
        next: data => {
          console.log("se agrego 100 extra de envio")
        }
      });
    }
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

  getImagesArray(imagenes: string, productId: number) {
    if (!imagenes) return [];

    return imagenes.split(';').map(imageName => {
      const imagePath = `${this.url}uploads/${productId}/${imageName.trim()}`;
      return {
        itemImageSrc: imagePath,
        thumbnailImageSrc: imagePath,
        alt: 'Imagen del producto',
        title: 'Producto'
      };
    });
  }


  cambiarAEstandar() {
    this.emergencia = false;
  }



}
