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
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

import { Dialog } from 'primeng/dialog';


import { Router } from '@angular/router';
import { Categorias } from '../../../Data/kit.types';

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

interface CategoriaEnKit {
  nombre: string;
  idProductos: number[];
  idProductoSeleccionado: number | null;
}



@Component({
  selector: 'app-crearkit',
  imports: [ReactiveFormsModule, Button, FileUpload, DropdownModule, Card, FloatLabel, DialogModule,
    InputTextModule,
    FormsModule,
    ToggleButtonModule,
    InputNumber, ButtonModule, CommonModule, BadgeModule, ToastModule],
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

  categorias: CategoriaEnKit[] = [];
  nuevaCategoriaNombre: string = '';

  productosDisponibles: any[] = []; // lista de todos los productos (puedes cargarla desde tu API)


  categoriaSeleccionada: any = null;
  productoParaCategoria: any = null;



  constructor(private fb: FormBuilder, private messageService: MessageService, private productService: ProductService, private router: Router
    , private config: PrimeNG
  ) { }

  ngOnInit(): void {
    this.home = this.isProd ? 'https://ladies-first.shop/' : '/';
    // Definimos el formulario reactivo
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      category: [null, Validators.required],
    });

    this.obtenerCategorias();

    this.fetchProducts();

  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }


  fetchProducts() {
    this.productService.getProductsMini()
      .then((data: producto[]) => {
        this.productos = data;
        this.updateProductosDropdown(); // <-- FALTA ESTO
      })
      .catch(error => {
        console.error('Error al obtener productos', error);
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



  kit = {
    nombre: '',
    descripcion: '',
    imagenes: '',
    disponible: false,
    precio: 0,
    categoriasJson: '' // Aquí meterás JSON.stringify(this.kitJson)
  };






  agregarCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) return;

    const nuevaCategoria: CategoriaEnKit = {
      nombre: this.nuevaCategoriaNombre.trim(),
      idProductos: [],
      idProductoSeleccionado: null
    };

    this.categorias.push(nuevaCategoria);
    this.nuevaCategoriaNombre = '';
    this.updateCategoriasDropdown(); // 👈 importante
  }


  agregarProductoACategoria(nombreCategoria: string, productoId: number) {
    const categoria = this.categorias.find(cat => cat.nombre === nombreCategoria);
    if (!categoria) return;

    if (!categoria.idProductos.includes(productoId)) {
      categoria.idProductos.push(productoId);
    }
  }


  seleccionarProducto(categoria: CategoriaEnKit, productoId: number) {
    categoria.idProductoSeleccionado = productoId;
  }

  eliminarCategoria(index: number) {
    this.categorias.splice(index, 1);
  }




  categoria: string = "";

  guardarCategoria() {
    const cat: Categorias = {
      Id: 0,
      categoria: this.categoria
    }
    console.log(cat)
    this.productService.newCategoria(cat).subscribe({
      next: data => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoria creada correctamente'
        });
      },
      error: data => {
        this.messageService.add({
          severity: 'success',
          summary: 'Error',
          detail: 'Intenta nuevamente'
        });
      }
    })
  }


  categorias_list: Categorias[] = [];
  categoriasDropdown: { label: string; value: string }[] = [];
  categoriaSeleccionadaId: number | null = null;


  obtenerCategorias() {
    this.productService.getCategorias().subscribe({
      next: data => {
        this.categoriasDropdown = data.map(cat => ({
          label: cat.categoria,
          value: cat.Id
        }));
      },
      error: err => {
        console.log("Error al obetner las categorias");
      }
    })
  }

  productosDropdown: { label: string; value: number }[] = [];



  updateCategoriasDropdown() {
    this.categoriasDropdown = this.categorias.map(cat => ({
      label: cat.nombre,
      value: cat.nombre
    }));
  }


  updateProductosDropdown() {
    this.productosDropdown = this.productos.map(prod => ({
      label: prod.nombre,
      value: prod.id!  // 
    }));

  }






  ///si se usara
  kitJson: any = {
    categorias: [],
    extras: [],
    precioFinal: null
  };

  cantidad: any = 0;
  agregarProductoACategoriaSeleccionada() {
    if (!this.categoriaSeleccionada || !this.productoParaCategoria) {
      return;
    }

    const nombreCategoria = this.categoriaSeleccionada.label;
    const idProducto = this.productoParaCategoria.value;
    const nombreProducto = this.productoParaCategoria.label

    const cantidad = this.cantidad;

    const categoriaExistente = this.kitJson.categorias.find((cat: { nombre: any; }) => cat.nombre === nombreCategoria);

    if (categoriaExistente) {
      const productoExistente = categoriaExistente.productos.find((p: { id: any; }) => p.id === idProducto);

      if (productoExistente) {
        productoExistente.cantidad += 1; // aumenta cantidad
      } else {
        categoriaExistente.productos.push({ id: idProducto, cantidad });
      }
    } else {
      this.kitJson.categorias.push({
        nombre: nombreCategoria,
        productos: [{ id: idProducto, cantidad }],
        idProductoSeleccionado: null
      });
    }

    this.categoriaSeleccionada = null;
    this.productoParaCategoria = null;
    this.cantidad = null;

    console.log('Kit actualizado:', this.kitJson);
  }



  eliminarProductoDeCategoria(nombreCategoria: string, idProducto: number) {
    const categoria = this.kitJson.categorias.find((c: { nombre: string; }) => c.nombre === nombreCategoria);

    if (!categoria) return;

    categoria.productos = categoria.productos.filter((p: { id: number; }) => p.id !== idProducto);

    // Si ya no hay productos, también podrías eliminar toda la categoría (opcional)
    if (categoria.productos.length === 0) {
      this.kitJson.categorias = this.kitJson.categorias.filter((c: { nombre: string; }) => c.nombre !== nombreCategoria);
    }

    console.log('Producto eliminado. Kit actualizado:', this.kitJson);
  }

  getNombreProducto(id: number): string {
    const p = this.productos.find(p => p.id === id);
    return p?.nombre || 'Producto no encontrado';
  }

  getImagenProducto(id: number): string {
    // Buscar el producto que tenga el id dado en this.productos
    const producto = this.productos.find(p => p.id === id);
    if (producto && producto.imagenes) {
      // Se asume que 'imagenes' es un string con los nombres de archivo separados por ';'
      const imagenesArray = producto.imagenes.split(';').filter(img => img.trim().length > 0);
      if (imagenesArray.length > 0) {
        // Toma la primera imagen
        const primeraImagen = imagenesArray[0].trim();
        // Puedes codificar la URL si es necesario con encodeURI
        return `https://ladies-first.shop/uploads/${id}/${encodeURI(primeraImagen)}`;
      }
    }
    // Retorna una imagen por defecto si no se encuentra
    return `https://ladies-first.shop/uploads/default-placeholder.png`;
  }
  


  guardarKit() {


    this.kit.categoriasJson = JSON.stringify(this.kitJson);
    console.log(this.kit)
    this.productService.createKit(this.kit).subscribe({
      next: data => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Se creo correctamente'
        });

      },
      error: err => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Error',
          detail: 'Intenta nuevamente'
        });
      }
    })
  }























}
