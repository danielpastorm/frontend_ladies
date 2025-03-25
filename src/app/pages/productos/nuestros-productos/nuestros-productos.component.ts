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


export interface KitDetail {
  kitId: number;
  kitNombre: string;
  kitDescripcion: string;
  kitPrecio: number;
  imagenes: string;      // Campo con las imágenes (posiblemente separadas por un delimitador)

  disponible: boolean;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

export interface KitGroup {
  kitId: number;
  kitNombre: string;
  kitDescripcion: string;
  imagenes: string;      // Campo con las imágenes (posiblemente separadas por un delimitador)

  kitPrecio: number;
  disponible: boolean;
  productos: KitDetail[];
}


@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [
    DataView, FileUpload, Badge, BadgeModule, ProgressBar, RippleModule, ToastModule, FormsModule, DialogModule,
    ButtonModule, DrawerModule, InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, CarouselModule, ToggleButtonModule,
    Tag,
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

  kitsDetails: KitDetail[] = []; // datos planos que recibes
  kitsGrouped: KitGroup[] = [];



  loading: boolean = false;
  deletingImageIndex: number = -1;

  visible: boolean = false;


  uploadedFiles: any[] = [];



  selectedKit!: KitGroup;
  displayEditModal: boolean = false;

  constructor(private http: HttpClient, private productService: ProductService, private messageService: MessageService, private cartService: ProductService) { }

  ngOnInit() {
    this.fetchKits();
  }
  getFirstImage(images: string): string {
    if (!images) return ''; // Verifica que no sea undefined o vacío

    const firstImage = images.split(',')[0].trim(); // Obtiene la primera imagen y elimina espacios
    return decodeURIComponent(firstImage); // Decodifica caracteres especiales como %20
  }

  fetchKits() {
    this.productService.getKits().subscribe(
      (data: any[]) => {
        this.kitsDetails = data;
        this.agruparKits();

        console.log('Kits obtenidos:', this.kitsDetails);
      },
      error => {
        console.error('Error al obtener kits:', error);
      }
    );
  }

  agruparKits() {
    // Utiliza reduce para agrupar por kitId
    const grouped = this.kitsDetails.reduce((acc: { [key: number]: KitDetail[] }, curr: KitDetail) => {
      if (!acc[curr.kitId]) {
        acc[curr.kitId] = [];
      }
      acc[curr.kitId].push(curr);
      return acc;
    }, {});

    // Transforma el objeto en un array de KitGroup, extrayendo los datos del kit del primer elemento de cada grupo
    this.kitsGrouped = Object.keys(grouped).map(key => {
      const items = grouped[+key]; // items es un array de KitDetail para este kitId
      return {
        kitId: +key,
        kitNombre: items[0].kitNombre,
        kitDescripcion: items[0].kitDescripcion,
        kitPrecio: items[0].kitPrecio,
        disponible: items[0].disponible,
        imagenes: items[0].imagenes, // se extrae el campo de imágenes
        productos: items
      } as KitGroup;
    });
  }


  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getSeverity(status: string) {
    switch (status) {
      case 'true':
        return 'success';
      case 'false':
        return 'warn';
      default: return
    }
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

  selectKit(kit: KitGroup) {
    // Clona el kit si es necesario (para no modificar la lista original)
    this.selectedKit = { ...kit };
    // Abre el modal de edición
    this.displayEditModal = true;
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

  updateProduct() {
    this.loading = true;
    this.productService.updateProduct(this.selectedProduct).subscribe({
      next: (response: string) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Producto actualizado',
          detail: response  // Por ejemplo: "Producto editado correctamente"
        });
        // Actualiza la lista local de productos o redirige según sea necesario
        this.visible = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el producto'
        });
        this.loading = false;
      }
    });
  }

  deleteImage(index: number) {
    this.deletingImageIndex = index;
    if (!this.selectedProduct || !this.selectedProduct.imagenesArray) {
      // Manejar el caso de que no exista el producto o el array de imágenes
      console.error('No hay producto seleccionado o imágenes disponibles.');
      return;
    }
    // Obtén la imagen a eliminar
    const imageToDelete = this.selectedProduct.imagenesArray[index];
    // Llama al endpoint para eliminar la imagen
    this.productService.deleteImage(this.selectedProduct.id, imageToDelete, false).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen eliminada',
          detail: 'La imagen ha sido eliminada correctamente.'
        });
        // Elimina la imagen del array local
        this.selectedProduct!.imagenesArray!.splice(index, 1);
      },
      error: (err) => {
        console.error('Error al eliminar imagen:', err);
        this.deletingImageIndex = -1;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen'
        });
      }
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


}
