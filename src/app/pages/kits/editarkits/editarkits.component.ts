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

import { Card } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CarouselModule } from 'primeng/carousel';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Select } from 'primeng/select';

import { ToggleButtonModule } from 'primeng/togglebutton';
import { Button } from 'primeng/button';


import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';

import { Badge, BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { producto, ProductoEnKitDTO } from '../crearkit/crearkit.component';
import { Kit } from '../../../Data/kit.types';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

export class productosEnKit {
  constructor(
    public productoId: number,
    public cantidad: number
  ) { }
}


export interface KitDetail {
  kitId: number;
  kitNombre: string;
  kitDescripcion: string;
  imagenes: string;       // Campo que contiene la(s) imagen(es) del kit
  kitPrecio: number;
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
  imagenes: string;       // Campo que contiene la(s) imagen(es) del kit
  kitPrecio: number;
  disponible: boolean;
  productos: KitDetail[];
}





@Component({
  selector: 'app-editarkits',
  imports: [ButtonModule, RippleModule, ToastModule, TableModule, CommonModule, DrawerModule, FormsModule, Button,
    InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, ToggleButtonModule, DataView,
    FileUpload, Tag, Select,
    BadgeModule,
    Badge,
    ProgressBar,
    DialogModule, Card, CarouselModule],
  templateUrl: './editarkits.component.html',
  styleUrl: './editarkits.component.css'
})
export class EditarkitsComponent {



  loading: boolean = false;
  deletingImageIndex: number = -1;

  kit: Kit[] = [];

  visible: boolean = false;
  products!: Producto[];

  selectedProduct!: Producto;

  uploadedFiles: any[] = [];

  kitsDetails: KitDetail[] = []; // datos planos que recibes
  kitsGrouped: KitGroup[] = [];

  selectedKit: KitGroup = {
    kitId: 0,
    kitPrecio: 0,
    kitNombre: '',
    kitDescripcion: '',
    imagenes: '',
    disponible: false,
    productos: []
  };

  displayEditModal: boolean = false;


  constructor(private productService: ProductService, private messageService: MessageService, private router: Router) { }
  isProd: boolean = false;
  url_server: string = '';
  productos: producto[] = [];


  displayEditKit: boolean = false;


  @ViewChild('fileUpload') fileUpload: FileUpload | undefined;


  ngOnInit() {
    if (this.isProd) {
      this.url_server = 'https://ladies-first.shop/';
    } else {
      this.url_server = 'https://localhost:7027';
    }

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
    
    
    this.fetchProducts();


    this.productService.getKits().subscribe(
      (data) => {
        this.kitsDetails = data;
        // Aquí podrías llamar a la función para agrupar los kits, por ejemplo:
        this.agruparKits();
      },
      (error) => {
        console.error('Error al obtener los kits:', error);
      }
    );

  }

  fetchProducts() {
    this.productService.getProductsMini()
      .then((data: producto[]) => {
        this.productos = data;
      })
      .catch(error => {
        console.error('Error al obtener kits', error);
      });
  }




  selectKit(kit: KitGroup) {
    // Clona el kit si es necesario (para no modificar la lista original)
    this.selectedKit = { ...kit };
    this.displayEditModal = true;
    console.log(this.selectedKit)
    // Abre el modal de edición
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




  deleteImage(index: number) {
    this.deletingImageIndex = index;
    if (!this.selectedKit || !this.selectedKit.imagenes) {
      // Manejar el caso de que no exista el producto o el array de imágenes
      console.error('No hay producto seleccionado o imágenes disponibles.');
      return;
    }
    // Obtén la imagen a eliminar
    const imageToDelete = this.selectedKit.imagenes[index];
    // Llama al endpoint para eliminar la imagen
    this.productService.deleteImage(this.selectedKit.kitId, imageToDelete, false).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen eliminada',
          detail: 'La imagen ha sido eliminada correctamente.'
        });
        // Elimina la imagen del array local
        this.selectedKit!.imagenes!.slice(index, 1);
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





  getKitImages(imagenes: string): string[] {
    if (!imagenes) {
      return [];
    }
    // Asume que las imágenes se almacenan separadas por ";".
    return imagenes.split(';').filter(img => img.trim().length > 0);
  }

  // Método para remover una imagen del kit
  removeKitImage(imageName: string): void {
    // Verificar si el kit y su propiedad 'imagenes' están definidos
    if (!this.selectedKit || !this.selectedKit.imagenes) {
      console.error('No hay kit seleccionado o no se ha definido la propiedad de imágenes.');
      return;
    }

    // Convertir la cadena a array
    let imagesArray = this.getKitImages(this.selectedKit.imagenes);

    // Buscar el índice de la imagen a eliminar
    const index = imagesArray.findIndex(img => img === imageName);
    if (index === -1) {
      console.warn(`La imagen '${imageName}' no se encontró en el kit.`);
      return;
    }

    // Llamar al servicio para eliminar la imagen en el backend
    this.productService.deleteImage(this.selectedKit.kitId, imageName, false).subscribe({
      next: () => {
        // Una vez eliminada en el servidor, la removemos localmente
        imagesArray.splice(index, 1);
        this.selectedKit.imagenes = imagesArray.join(',');

        // Notificar éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen eliminada',
          detail: 'La imagen ha sido eliminada correctamente.'
        });
      },
      error: (err) => {
        console.error('Error al eliminar imagen en el servidor:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen en el servidor.'
        });
      }
    });
  }


  // // Método para eliminar imagen de la lista actual
  // deleteKitImage(index: number): void {
  //   // Elimina la imagen de la lista (podrías confirmar con el usuario)
  //   this.selectedKit.imagenesArray.splice(index, 1);
  // }

  removeProductFromKit(productId: number): void {
    const index = this.selectedKit.productos.findIndex(p => p.productoId === productId);
    if (index !== -1) {
      this.selectedKit.productos.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Producto eliminado',
        detail: 'El producto ha sido eliminado del kit.'
      });
    }
  }



  selectedProducto: any;
  cantidad: number = 1;
  images: string[] = [];
  selectedImages: string[] = [];
  productosAgregados: any[] = [];
  selectedFiles: any[] = [];

  home: string = "";



  agregarProducto() {
    if (this.selectedProducto && this.cantidad > 0) {
      // Crea el DTO con el id del producto y la cantidad (si lo necesitas, sino lo puedes omitir)
      const productoDTO = new ProductoEnKitDTO(this.selectedProducto.id, this.cantidad);

      // Construir un objeto de tipo KitDetail combinando la información del kit y del producto
      const productoAgregado: KitDetail = {
        kitId: this.selectedKit.kitId,
        kitNombre: this.selectedKit.kitNombre,
        kitDescripcion: this.selectedKit.kitDescripcion,
        imagenes: this.selectedKit.imagenes, // o quizás una función que retorne la imagen principal del kit
        kitPrecio: this.selectedKit.kitPrecio, // este valor podría recalcularse si es necesario
        disponible: this.selectedKit.disponible,
        productoId: this.selectedProducto.id,
        nombreProducto: this.selectedProducto.nombre,
        cantidad: this.cantidad,
        precioUnitario: this.selectedProducto.precio,
        // Puedes incluir el DTO si lo requieres:
      };

      // Agrega el objeto al arreglo de productos del kit
      this.selectedKit.productos.push(productoAgregado);
      this.messageService.add({
        severity: 'info',
        summary: 'Producto agregado',
        detail: 'El producto ha sido agregado al kit.'
      });
      console.log('Producto agregado:', productoAgregado);
      console.log('Kit products:', this.selectedKit.productos);

      // Reinicia la selección y la cantidad
      this.selectedProducto = null;
      this.cantidad = 1;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Error al agregar',
        detail: 'Seleccione un producto y especifique una cantidad válida'
      });

      console.warn('Seleccione un producto y especifique una cantidad válida');
    }
  }





  update() {
    this.loading = true;
    console.log(this.selectKit)

    const kitToUpdate: Kit = {
      id: this.selectedKit.kitId,           // suponiendo que selectedKit tiene "id" en lugar de "Id"
      nombre: this.selectedKit.kitNombre,   // y "nombre" en lugar de "Nombre"
      descripcion: this.selectedKit.kitDescripcion,
      disponible: this.selectedKit.disponible,
      productosEnKit: this.selectedKit.productos
    };

    this.productService.updateKit(kitToUpdate).subscribe({
      next: (response: string) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Kit actualizado',
          detail: response  // Por ejemplo: "Producto editado correctamente"
        });
        // Actualiza la lista local de productos o redirige según sea necesario
        this.visible = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al actualizar el kit:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el kit'
        });
        this.loading = false;
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
    this.selectedFiles = [];
  }

  onClear(event: any): void {
    console.log('FileUpload se ha limpiado:', event);
    this.selectedFiles = [];
  }





}
