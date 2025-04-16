import { Component, ViewChild } from '@angular/core';
import { Producto } from '../../../Data/producto.types';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';


import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';



import { ToggleButtonModule } from 'primeng/togglebutton';



import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';

import { Badge, BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}


@Component({
  selector: 'app-editarproductos',
  imports: [ButtonModule, RippleModule, ToastModule, TableModule, CommonModule, DrawerModule, FormsModule,
    InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, ToggleButtonModule,
    FileUpload, BadgeModule, DialogModule
  ],
  templateUrl: './editarproductos.component.html',
  styleUrl: './editarproductos.component.css',
})
export class EditarproductosComponent {
  loading: boolean = false;
  deletingImageIndex: number = -1;

  visible: boolean = false;
  products!: Producto[];

  selectedProduct!: Producto;

  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;
  selectedFiles: any[] = [];

  uploadedFiles: any[] = [];



  constructor(private productService: ProductService, private messageService: MessageService, private router: Router) { }



  ngOnInit() {
    this.productService.getProductsMini().then((data) => {
      this.products = data;

      // Convertir la cadena de imágenes en un array con la ruta correcta
      this.products.forEach(product => {
        product.imagenesArray = product.imagenes
          ? product.imagenes.split(';').map(img =>
            `uploads/${product.id}/${img.trim()}`
          )
          : [];
      });
    });

  }

  getFirstImage(product: any): string {
    if (!product || !product.imagenesArray || product.imagenesArray.length === 0) {
      return ''; // Retorna cadena vacía si no hay imágenes
    }
    return product.imagenesArray[0]; // Retorna la primera imagen si existe
  }


  selectProduct(product: Producto) {
    this.productService.getProductDetails(product.id).subscribe({
      next: (detalle) => {
        this.selectedProduct = detalle;
        // Mapea las imágenes solo si existen; de lo contrario, asigna un array vacío
        this.selectedProduct.imagenesArray = this.selectedProduct.imagenes
          ? this.selectedProduct.imagenes.split(';').map(img =>
            `uploads/${this.selectedProduct.id}/${img.trim()}`
          )
          : [];
        this.visible = true;
      },
      error: (error) => {
        console.error('Error al obtener detalles:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener el detalle del producto'
        });
      }
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
 
  onSelect(event: any): void {
    // Guarda los archivos seleccionados
    this.selectedFiles = event.files;
    console.log('Archivos seleccionados:', this.selectedFiles);
  }

  onUpload(event: any): void {
    console.log('Evento onUpload:', event);
    // Aquí, en modo basic, event.files puede estar vacío,
    // por lo que puedes usar this.selectedFiles para conocer qué se subió.
    for (let file of this.selectedFiles) {
      this.uploadedFiles.push(file);
    }

    // Si el servidor retorna respuesta, intenta obtenerla
    const responseText = event.xhr && event.xhr.response ? event.xhr.response : 'Las imágenes fueron agregadas correctamente.';
    this.messageService.add({
      severity: 'info',
      summary: 'Archivos subidos',
      detail: responseText
    });

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    // Limpiar la variable de archivos seleccionados
    this.selectedFiles = [];
  }

  onError(event: any): void {
    console.error('Error en la subida:', event);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al subir las imágenes.'
    });
  }

  onClear(event: any): void {
    console.log('FileUpload se ha limpiado:', event);
  }


}
