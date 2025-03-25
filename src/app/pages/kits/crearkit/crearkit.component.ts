import { afterNextRender, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { Card } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Badge, BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { FileUploadEvent } from 'primeng/fileupload';
import { ProductService } from '../../../services/product.service';

import { Select } from 'primeng/select';

import { Router } from '@angular/router';

export class ProductoEnKitDTO {
  constructor(
    public productoId: number,
    public cantidad: number
  ) { }
}

export class KitDTO {
  constructor(
    public nombre: string,
    public descripcion: string,
    public disponible: boolean,
    public productosEnKit: ProductoEnKitDTO[] = []
  ) { }
}


// kit.model.ts
export interface ProductoEnKit {
  productoId: number;
  cantidad: number;
  // Puedes agregar otros campos según necesites, por ejemplo:
  // producto?: Producto;
}

export interface Kit {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
  productosEnKit: ProductoEnKit[];
}

export interface producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenes: string;
}


@Component({
  selector: 'app-crearkit',
  imports: [ReactiveFormsModule, Button, FileUpload, DropdownModule, Card,
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    ToggleButtonModule,
    InputNumber, ButtonModule, CommonModule, BadgeModule, Badge, ProgressBar, ToastModule, Select],
  templateUrl: './crearkit.component.html',
  styleUrl: './crearkit.component.css'
})
export class CrearkitComponent {
  checked: boolean = false;
  //archivos
  uploadedFiles: any[] = [];

  productos: producto[] = [];


  selectedKit: any = {
    id: null,
    nombre: '',
    descripcion: '',
    disponible: false,
    precio: null,
    productoSeleccionado: null,
    productosAgregados: [],
    imagenes: []
  };

  //demas 

  selectedProducto: any;
  cantidad: number = 1;
  images: string[] = [];
  productForm!: FormGroup;
  selectedImages: string[] = [];
  productosAgregados: any[] = [];

  isProd: boolean = false;
  home: string = "";

  // Ejemplo de categorías
  categories = [
    { label: 'Categoría 1', value: 'cat1' },
    { label: 'Categoría 2', value: 'cat2' },
    { label: 'Categoría 3', value: 'cat3' },
  ];
  constructor(private fb: FormBuilder, private messageService: MessageService, private productService: ProductService, private router: Router
    , private config: PrimeNG
  ) { }

  ngOnInit(): void {
    this.home = this.isProd ? 'https://ladies-first.shop/' :'/'; 
    // Definimos el formulario reactivo
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      category: [null, Validators.required],
    });
   
    this.fetchProducts();

  }

  removeProducto(index: number) {
    this.productosAgregados.splice(index, 1);
  }

  agregarProducto() {
    if (this.selectedProducto && this.cantidad > 0) {
      // Crea el DTO con el id del producto y la cantidad
      const productoDTO = new ProductoEnKitDTO(this.selectedProducto.id, this.cantidad);

      // Crea un objeto que combine la información completa del producto y el DTO
      const productoAgregado = {
        ...this.selectedProducto,  // Detalles completos del producto
        cantidad: this.cantidad,     // Cantidad agregada
        dto: productoDTO             // El DTO con productoId y cantidad
      };

      // Agrega este objeto al array que usas para visualización
      this.productosAgregados.push(productoAgregado);

      console.log('Producto agregado:', productoAgregado);

      // Reinicia la selección y la cantidad
      this.selectedProducto = null;
      this.cantidad = 1;
    } else {
      console.warn('Seleccione un producto y especifique una cantidad válida');
    }
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



  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }


  /**
   * Evento que se dispara al seleccionar imágenes en el p-fileUpload
   */
  onImageSelect(event: any) {
    // event.files contiene los archivos seleccionados
    for (let file of event.files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Guardamos la imagen en base64 en el array
        this.selectedImages.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Evento que se dispara al eliminar una imagen desde el p-fileUpload
   * (si usas la función de eliminar interna de p-fileUpload)
   */
  onImageRemove(event: any) {
    // Aquí podrías buscar el archivo en selectedImages y removerlo
    // Si guardas la base64, necesitas una forma de identificarla
    // En este ejemplo, preferimos manejar la eliminación manual (removeImage(i))
  }

  /**
   * Evento que se dispara al hacer clear en el p-fileUpload
   */
  onImageClear() {
    // Limpiamos la lista de imágenes
    this.selectedImages = [];
  }

  /**
   * Eliminar una imagen individual de la previsualización
   */
  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  /**
   * Guardar o enviar el formulario
   */
  onSubmit() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        images: this.selectedImages
      };

      // Lógica para guardar en tu backend o servicio
      console.log('Producto a guardar:', productData);
      alert('¡Producto creado con éxito!');

      // Reseteamos el formulario e imágenes
      this.productForm.reset();
      this.selectedImages = [];
    } else {
      // Marcamos todos los campos como tocados para mostrar errores
      this.productForm.markAllAsTouched();
    }
  }

  updateKit() {
    // Lógica para enviar el kit al backend
  }



  // Objeto kit que se enviará al backend
  kit: Kit = {
    nombre: '',
    descripcion: '',
    precio: 0,
    disponible: false,
    productosEnKit: []  // Ahora es ProductoEnKit[]
  };




  guardarKit() {
    // Mapea el array de productos agregados a un array con solo productoId y cantidad
    this.kit.productosEnKit = this.productosAgregados.map(p => ({
      productoId: p.id,
      cantidad: p.cantidad
    }));

    console.log('Kit a enviar:', this.kit);

    this.productService.createKit(this.kit).subscribe(
      response => {
        console.log('Kit creado exitosamente:', response);
        // Mostrar mensaje de éxito
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Kit creado correctamente'
        });

        this.limpiarFormulario();


      },
      error => {
        console.error('Error al crear el kit:', error);
      }
    );
  }


  limpiarFormulario() {
    // Reinicia el formulario reactivo
    this.productForm.reset();

    // Limpia la lista de productos agregados
    this.productosAgregados = [];

    // Reinicia cualquier otra variable si es necesario
    this.kit = {
      nombre: '',
      descripcion: '',
      precio: 0,
      
      disponible: false,
      productosEnKit: []
    };

    // Opcional: limpiar imágenes, etc.
    this.selectedImages = [];
  }








  



}
