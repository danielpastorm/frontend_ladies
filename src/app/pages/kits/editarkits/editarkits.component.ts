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
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';  // <-- Importa FormsModule
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { ReactiveFormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CarouselModule } from 'primeng/carousel';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Select, SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ToggleButtonModule } from 'primeng/togglebutton';
import { Button } from 'primeng/button';


import { PrimeNG } from 'primeng/config';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';

import { Badge, BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { ProductoEnKitDTO } from '../crearkit/crearkit.component';
import { Categorias } from '../../../Data/kit.types';
import { TextareaModule } from 'primeng/textarea';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FloatLabel } from 'primeng/floatlabel';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { KitDto, OpcionSeleccion, ProductoEstatico } from '../../../Data/KitsModel';
import { MultiSelectItem, MultiSelectModule } from 'primeng/multiselect';
import { Image } from 'primeng/image';
import { DividerModule } from 'primeng/divider';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface CategoriaEnKit {
  nombre: string;
  idProductos: number[];
  idProductoSeleccionado: number | null;
}


@Component({
  selector: 'app-editarkits',
  imports: [ButtonModule, RippleModule, ToastModule, TableModule, CommonModule, DrawerModule, FormsModule, Button,
    InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, ToggleButtonModule,
    FileUpload, DropdownModule, ProgressSpinnerModule, Image, DividerModule, ConfirmPopupModule,
    BadgeModule, ReactiveFormsModule, TextareaModule, FloatLabel, MultiSelectModule, SelectModule,
    DialogModule, Card, CarouselModule],
  providers: [ConfirmationService],
  templateUrl: './editarkits.component.html',
  styleUrl: './editarkits.component.css'
})
export class EditarkitsComponent {
  productos!: any[];
  selectedExtraProducts: any | undefined;
  categoria: string = "";

  imagenesArray: string[] = [];
  apiurl: string = environment.apiUrl;
  imageUploadsUrl: string = this.apiurl + 'Images/AgregarImagenesKit/'



  apiUrl = environment.apiUrl;
  kits: KitDto[] = [];
  visible: boolean = false;
  kitEnEdicion: any;

  categoriaSeleccionada: any = null;
  productoParaCategoria: any = null;
  cantidad: any = 0;



  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargarKits();


    this.productService.getProducts().subscribe({
      next: data => this.productos = data.map(prod => ({
        id: prod.id,
        precio: prod.precio,
        name: prod.nombre,
        code: prod.id
      }))
    })

  }

  cargarKits() {
    this.productService.getKitsNuevo().subscribe((data) => {
      this.kits = data.map(kit => ({
        ...kit,
        imagenesArray: kit.imagenes
          ? kit.imagenes.split(';').map(s => s.trim())
          : []
      }));
      console.log(this.kits);
    });
  }


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



  categorias: CategoriaEnKit[] = [];

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




  editarKit(id: number) {
    this.kitEnEdicion = [];
    // 1) Buscas el kit original
    const original = this.kits.find(k => k.id === id);
    if (!original) return;

    // 2) Clonas (deep copy) para no mutar la lista
    this.kitEnEdicion = {
      ...original,
    };
    this.visible = true;
  }





  // 1) Productos estáticos
  removeProductoEstatico(i: number) {
    this.kitEnEdicion.productosEstaticos.splice(i, 1);
  }
  addProductoEstatico() {
    this.kitEnEdicion.productosEstaticos.push({
      id: 0,
      kitId: this.kitEnEdicion.id,
      productoId: null,
      cantidad: 1
    });
  }

  // 2) Opciones de selección
  removeOpcionSeleccion(j: number) {
    this.kitEnEdicion.opcionesSeleccion.splice(j, 1);
  }
  addOpcionSeleccion() {
    this.kitEnEdicion.opcionesSeleccion.push({
      id: 0,
      kitId: this.kitEnEdicion.id,
      titulo: '',
      orden: this.kitEnEdicion.opcionesSeleccion.length + 1,
      productos: []
    });
  }

  removeProductoSeleccion(j: number, k: number) {
    this.kitEnEdicion.opcionesSeleccion[j].productos.splice(k, 1);
  }
  addProductoSeleccion(j: number) {
    this.kitEnEdicion.opcionesSeleccion[j].productos.push({
      id: 0,
      opcionSeleccionId: this.kitEnEdicion.opcionesSeleccion[j].id,
      productoId: null,
      cantidad: 1
    });
  }

  // 3) Imágenes
  imgUrl(img: string, id: number) {
    return `${this.apiUrl}/uploads/kit_${id}/${img}`; // ajusta según tu endpoint
  }
  removeImage(idx: number) {
    this.productService.deleteImage(this.kitEnEdicion.id, this.kitEnEdicion.imagenesArray[idx], true).subscribe({
      next: () => {
        this.kitEnEdicion.imagenesArray.splice(idx, 1);
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se elimino la imagen', life: 3000 });


      }
    });
  }


  onImageUpload(event: any) {
    // tu lógica: subes al servidor, obtienes nombre y:
    event.files.forEach((file: File) => {
      // tras subir...
      const nuevoNombre = "";
      this.kitEnEdicion.imagenesArray.push(nuevoNombre);
    });
  }

  // 4) Guardar cambios
  saveKit() {
    // arma el payload con kitEnEdicion,
    // llama a tu productService.updateKit(this.kitEnEdicion) y cierra dialog
  }




  //OPCIONES DE LA CREACION DE KITS


  kitJson: any = {
    categorias: [],
    extras: [],
    precioFinal: null
  };
  guardarKit() {
    this.kitEnEdicion.categoriasJson = JSON.stringify(this.kitJson);
    console.log(this.kitEnEdicion);

    this.productService.updateKit(this.kitEnEdicion).subscribe({
      next: () => {
        this.messageService.add({severity: 'info', summary: 'Kit actualizado', life: 3000})
      }
    })

  }

  calcularDescuento() {
    if (this.kitEnEdicion.descuento > 100) this.kitEnEdicion.descuento = 100;
    if (this.kitEnEdicion.descuento < 0) this.kitEnEdicion.descuento = 0;

    this.kitEnEdicion.precioConDescuento = this.kitEnEdicion.precio - (this.kitEnEdicion.precio * (this.kitEnEdicion.descuento / 100))

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
      const imagenesArray = producto.imagenes.split(';').filter((img: { trim: () => { (): any; new(): any; length: number; }; }) => img.trim().length > 0);
      if (imagenesArray.length > 0) {
        // Toma la primera imagen
        const primeraImagen = imagenesArray[0].trim();
        // Puedes codificar la URL si es necesario con encodeURI
        return `${this.apiUrl}uploads/${id}/${encodeURI(primeraImagen)}`;
      }
    }
    // Retorna una imagen por defecto si no se encuentra
    return `${this.apiUrl}/uploads/default-placeholder.png`;
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


  uploadedFiles: any[] = [];

  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
    // (2) vuelvo a traer la lista de kits, y sólo cuando llegue ejecuto editarKit
    this.productService.getKitsNuevo().subscribe(data => {
      this.kits = data.map(kit => ({
        ...kit,
        imagenesArray: kit.imagenes
          ? kit.imagenes.split(';').map(s => s.trim())
          : []
      }));
      // (3) ahora sí, reasigno el kitEnEdicion con la info actualizada:
      this.editarKit(this.kitEnEdicion.id);
    });

  }


  confirm2(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Seguro que quieres eliminar este kit?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger'
      },
      accept: () => {
        this.productService.deleteProducto(id).subscribe({
          next: data => {
            this.cargarKits();
          }
        });
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se elimino el kit', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'No se modifico nada', life: 3000 });
      }
    });
  }



  //productos estaticos

  productosEstaticos: ProductoEstatico[] = [];
  opcionesSeleccion: OpcionSeleccion[] = [];
  catalogoProductos: any[] = []; // cargar con tus productos desde la API


  agregarEstatico() {
    this.productosEstaticos.push({ IdProducto: 0, Cantidad: 1 });
  }

  eliminarEstatico(index: number) {
    this.productosEstaticos.splice(index, 1);
  }

  agregarOpcion() {
    this.opcionesSeleccion.push({
      titulo: '',
      orden: this.opcionesSeleccion.length + 1,
      productos: []
    });
  }

  agregarProductoOpcion(i: number) {
    this.opcionesSeleccion[i].productos.push({ ProductoId: 0, Cantidad: 1 });
  }

  eliminarProductoOpcion(i: number, j: number) {
    this.opcionesSeleccion[i].productos.splice(j, 1);
  }










}
