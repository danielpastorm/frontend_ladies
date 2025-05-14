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
import { environment } from '../../../../environments/environment';


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
  url: string = environment.apiUrl;
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



  deleteImage(index: number): void {
    const producto = this.selectedProduct;

    if (!producto || !producto.imagenesArray || !producto.imagenesArray[index]) {
      console.error('No hay producto seleccionado o imagen válida en el índice:', index);
      return;
    }

    const imageToDelete = producto.imagenesArray[index];
    this.deletingImageIndex = index;

    this.productService.deleteImage(producto.id, imageToDelete, false).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen eliminada',
          detail: 'La imagen ha sido eliminada correctamente.'
        });

        // Eliminar imagen de imagenesArray
        const nuevasImagenes = producto.imagenesArray!.filter((_, i) => i !== index);
        this.selectedProduct!.imagenesArray = nuevasImagenes;

        // Reconstruir el string imagenes
        this.selectedProduct!.imagenes = nuevasImagenes
          .map(img => img.split('/').pop())
          .join(';');

        this.deletingImageIndex = -1;

        // 👉 Actualiza también la lista general
        this.recargarImagenes();
      },
      error: (err) => {
        console.error('Error al eliminar imagen:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen'
        });
        this.deletingImageIndex = -1;
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

    this.recargarImagenes();
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

  recargarImagenes() {
    const producto = this.selectedProduct;
    if (!producto) return;
  
    this.productService.getProductDetails(producto.id).subscribe({
      next: (detalle) => {
        // Actualiza el producto en el modal
        this.selectedProduct!.imagenesArray = detalle.imagenes
          ? detalle.imagenes.split(';').map(img =>
              `uploads/${producto.id}/${img.trim()}`
            )
          : [];
  
        // También actualiza en la lista general
        const index = this.products.findIndex(p => p.id === producto.id);
        if (index !== -1) {
          this.products[index].imagenesArray = this.selectedProduct!.imagenesArray;
          this.products[index].imagenes = detalle.imagenes;
        }
      }
    });
  }
  
  
  



}
