import { Component, OnInit } from '@angular/core';

import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataViewModule } from 'primeng/dataview';
import { Card, CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { ProductService } from '../../../services/product.service';
import { Toast } from 'primeng/toast';
import { Carousel } from 'primeng/carousel';
import { Dialog } from 'primeng/dialog';
import { Producto } from '../../../Data/producto.types';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FileUpload } from 'primeng/fileupload';

import { Badge, BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';




import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CarouselModule } from 'primeng/carousel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PrimeNG } from 'primeng/config';

import { Dropdown, DropdownModule } from 'primeng/dropdown';




@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [
    DataView, FileUpload, Badge, BadgeModule, ProgressBar, RippleModule, ToastModule, FormsModule, DialogModule,
    ButtonModule, DrawerModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, CarouselModule, ToggleButtonModule,
    Tag, DropdownModule, ProgressSpinnerModule,
    TableModule,
    RatingModule,
    CommonModule,
    DataViewModule, CardModule, Toast, Carousel, Dialog, FloatLabel
  ],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css',

})
export class NuestrosProductosComponent implements OnInit {
  selectedProduct!: Producto;

  products: any[] = [];
  sortField: string = 'precio';
  sortOrder: number = 1;
  sortOptions = [
    { label: 'Precio: Menor a Mayor', value: 'precio' },
    { label: 'Precio: Mayor a Menor', value: '!precio' }
  ];
  sortKey: string = 'precio';




  loading: boolean = false;
  deletingImageIndex: number = -1;

  visible: boolean = false;


  uploadedFiles: any[] = [];
  cargando: boolean = true;




  displayEditModal: boolean = false;


  ////////////////
  kits: any[] = [];
  productosCatalogo: any[] = [];
  kitSeleccionado: any = null;
  mostrarModal = false;
  productosExtras: number[] = [];

  productos: any[] = [];


  constructor(private http: HttpClient, private productService: ProductService, private messageService: MessageService, private cartService: ProductService) { }

  ngOnInit() {
    this.cargando = true;
    this.productService.getProducts().subscribe(data => {
      this.productos = data;
      console.log('Productos cargados:', this.productos);
    });


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
      this.cargando = false;

      console.log('Kits procesados:', this.kits);
    });


  }

  obtenerUrlImagen(id: number, nombreImagen: string): string {
    return `https://localhost:7027/uploads/kit_${id}/${nombreImagen}`;
  }

  seleccionarKit(kit: any) {
    this.kitSeleccionado = JSON.parse(JSON.stringify(kit)); // copia profunda
    this.productosExtras = [];
    this.mostrarModal = true;
  }

  getNombreProducto(id: number): string {
    return this.productosCatalogo.find(p => p.id === id)?.nombre || `ID ${id}`;
  }

  getImagenProducto(id: number): string {
    return `/uploads/productos/${id}.jpg`;
  }

  agregarExtra(id: number) {
    if (!this.productosExtras.includes(id)) {
      this.productosExtras.push(id);
    }
  }

  quitarExtra(id: number) {
    this.productosExtras = this.productosExtras.filter(p => p !== id);
  }

  confirmarSeleccion() {
    console.log('Kit personalizado:', this.kitSeleccionado);
    console.log('Extras:', this.productosExtras);
    this.mostrarModal = false;
  }




  getFirstImage(images: string): string {
    if (!images) return ''; // Verifica que no sea undefined o vacío

    const firstImage = images.split(';')[0].trim(); // Obtiene la primera imagen y elimina espacios
    return decodeURIComponent(firstImage); // Decodifica caracteres especiales como %20
  }



  getKitImages(imagenes: string): string[] {
    if (!imagenes) {
      console.log("vacio");

      return [];
    }
    // Asume que las imágenes se almacenan separadas por ";".
    console.log(imagenes.split(';').filter(img => img.trim().length > 0));

    return imagenes.split(';').filter(img => img.trim().length > 0);
  }


  onUpload(event: any): void {
    // Agregar los archivos a tu array, si lo requieres
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    // Obtener la respuesta del servidor, asumiendo que se encuentra en event.xhr.responseText o response
    const responseText = event.xhr && event.xhr.response ? event.xhr.response : 'Las imágenes fueron agregadas correctamente.';

    // Mostrar el mensaje usando el MessageService
    this.messageService.add({
      severity: 'info',
      summary: 'Archivos subidos',
      detail: responseText
    });
  }



  addKitToCart(kit: any) {
    const cartItem = {
      userId: localStorage.getItem("Id"),
      productoId: null, // Es un kit, no un producto individual
      kitId: kit.kitId,
      cantidad: 1, // Se puede modificar si el usuario selecciona una cantidad mayor
      precioUnitario: kit.kitPrecio // Precio total del kit
    };

    this.cartService.addToCart(cartItem).subscribe(() => {
      console.log("Kit agregado al carrito:", kit);
      this.messageService.add({
        severity: 'success',
        summary: 'Kit agregado correctamente',
        detail: 'se agrego el kit a tu carrito'
      });
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo agregar' + error
      });
    });
  }


  getOpcionesProductos(categoria: any): any[] {
    console.log("categora", categoria)
    return categoria.productos.map((p: any) => ({
      label: this.getNombreProductos(p.id),
      value: p.id
    }));
  }

  getNombreProductos(id: number): string {
    const p = this.productos.find(prod => prod.id === id);
    return p?.nombre || `Producto ID: ${id}`;
  }




}
