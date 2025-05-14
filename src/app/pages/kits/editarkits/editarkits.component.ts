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
import { Select } from 'primeng/select';
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
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}


@Component({
  selector: 'app-editarkits',
  imports: [ButtonModule, RippleModule, ToastModule, TableModule, CommonModule, DrawerModule, FormsModule, Button,
    InputGroupModule, InputGroupAddonModule, InputTextModule, InputNumberModule, FloatLabelModule, ToggleButtonModule,
    FileUpload, DropdownModule, ProgressSpinnerModule,
    BadgeModule, ReactiveFormsModule, TextareaModule, FloatLabel,
    DialogModule, Card, CarouselModule],
  providers: [ConfirmationService],
  templateUrl: './editarkits.component.html',
  styleUrl: './editarkits.component.css'
})
export class EditarkitsComponent {
  apiUrl:string = environment.apiUrl;
  kits!: any;
  cargando: boolean = false;
  abrirModal: boolean = false;
  miFormulario!: FormGroup;
  kitEditando: any = null;
  productos!: any;
  categoria: string = "";
  idKit: number = 0;

  productosDropdown: { label: string; value: number }[] = [];



  kitJson: any = {
    categorias: [],
    extras: [],
    precioFinal: null
  };


  constructor(private fb: FormBuilder, private messageService: MessageService, private productService: ProductService, private router: Router
    , private config: PrimeNG, private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.productService.getKits().subscribe({
      next: data => {
        this.kits = data;
      }
    })

    this.productService.getProducts().subscribe({
      next: data => {
        this.productos = data;
        this.productosDropdown = data.map(prod => ({
          label: prod.nombre,
          value: prod.id
        }));
      }
    })


    this.cargando = false;



    this.miFormulario = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      imagenes: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      disponible: [false],
      descuento: [0],
      precioConDescuento: [0]
    });


  }


  editarKit(kit: any) {
    this.kitEditando = kit;
    this.idKit = kit.id;
    this.miFormulario.patchValue({
      id: kit.id,
      nombre: kit.nombre,
      descripcion: kit.descripcion,
      imagenes: kit.imagenes,
      precio: kit.precio,
      disponible: kit.disponible,
      descuento: kit.descuento,
      precioConDescuento: kit.precioConDescuento
    });

    this.kitJson = JSON.parse(kit.categoriasJson || '{"categorias":[],"extras":[],"precioFinal":null}');

    this.abrirModal = true;
  }



  onSubmit(): void {
    if (this.miFormulario.valid) {
      const nuevoNombre = this.miFormulario.value.nombre;
      const nuevaDescripcion = this.miFormulario.value.descripcion;
      const nuevoPrecio = this.miFormulario.value.precio;
      const nuevasCategorias = this.miFormulario.value.categoriasJson;
      const nuevoDisponible = this.miFormulario.value.disponible;
      const descuento = this.miFormulario.value.descuento;

    

      // Actualizamos directamente el kit en memoria
      this.kitEditando.nombre = nuevoNombre;
      this.kitEditando.descripcion = nuevaDescripcion;
      this.kitEditando.precio = nuevoPrecio;
      this.kitEditando.categoriasJson = JSON.stringify(this.kitJson);
      this.kitEditando.disponible = nuevoDisponible;
      if(descuento != 0){
        this.kitEditando.descuento = descuento;
        this.kitEditando.precioConDescuento = nuevoPrecio - (nuevoPrecio * (descuento / 100));
      }
      else{
        this.kitEditando.descuento = 0;
        this.kitEditando.preciocondescuento = 0;
      }

      console.log(this.kitEditando.descuento)

      // Aquí puedes mandar al backend si lo deseas con productService.updateKit()
      this.productService.updateKit(this.kitEditando).subscribe({
        next: data => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Kit editado correctamente'
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
      console.log('Kit actualizado:', this.kitEditando);

      this.abrirModal = false;
    } else {
      this.miFormulario.markAllAsTouched();
    }
  }



  getNombreProducto(id: number): string {
    const producto = this.productos.find((p: { id: number; }) => p.id === id);
    return producto ? producto.nombre : `ID: ${id}`;
  }

  // Agregar producto
  agregarProductoACategoria(categoria: any) {
    const productoId = categoria.productoSeleccionado?.value;
    const cantidad = categoria.cantidadSeleccionada;

    if (!productoId || !cantidad || cantidad <= 0) return;

    const existe = categoria.productos.find((p: any) => p.id === productoId);
    if (existe) {
      existe.cantidad += cantidad;
    } else {
      categoria.productos.push({ id: productoId, cantidad });
    }

    // Limpia selección
    categoria.productoSeleccionado = null;
    categoria.cantidadSeleccionada = null;
  }

  // Eliminar producto
  eliminarProductoDeCategoria(nombreCategoria: string, idProducto: number) {
    const categoria = this.kitJson.categorias.find((c: any) => c.nombre === nombreCategoria);
    if (!categoria) return;

    categoria.productos = categoria.productos.filter((p: any) => p.id !== idProducto);

    // Si ya no tiene productos, puedes eliminar la categoría si lo deseas
    // this.kitJson.categorias = this.kitJson.categorias.filter((c: any) => c.nombre !== nombreCategoria);
  }


  crearYAgregarCategoria() {
    const cat: Categorias = {
      Id: 0,
      categoria: this.categoria
    };

    this.productService.newCategoria(cat).subscribe({
      next: (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoría creada correctamente'
        });

        // Agregar la categoría también al kitJson directamente
        this.kitJson.categorias.push({
          nombre: this.categoria,
          productos: [],
          idProductoSeleccionado: null
        });

        // Resetear input
        this.categoria = '';

      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Intenta nuevamente'
        });
      }
    });
  }


  eliminarCategoriaDelKit(index: number) {
    this.kitJson.categorias.splice(index, 1);

    this.messageService.add({
      severity: 'info',
      summary: 'Categoría eliminada',
      detail: 'Se quitó correctamente del kit'
    });
  }


  getImagenesArray(): string[] {
    if (!this.kitEditando?.imagenes) return [];

    return this.kitEditando.imagenes
      .split(';')
      .map((img: string) => `${this.apiUrl}uploads/kit_${this.kitEditando.id}/${img.trim()}`);
  }


  imagenSubida(event: any) {
    // Puedes refrescar la lista de imágenes desde el backend si lo deseas
    this.messageService.add({
      severity: 'success',
      summary: 'Imagen subida',
      detail: 'Se agregó correctamente'
    });

    this.actualizarKitDesdeBackend(this.kitEditando.id);
  }

  loading: boolean = false;
  eliminarImagen(urlImagenCompleta: string) {
    const imageName = urlImagenCompleta.split('/').pop() ?? '';
    const kitId = this.kitEditando.id;
    this.loading = true;
    this.productService.deleteImage(kitId, imageName, true).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Imagen eliminada',
          detail: 'La imagen se eliminó correctamente'
        });
        this.actualizarKitDesdeBackend(kitId);
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la imagen'
        });
        this.loading = false;
      }
    });
  }



  actualizarKitDesdeBackend(id: number) {
    this.productService.getKitById(id).subscribe({
      next: (kit) => {

        this.kitEditando = kit;

        // Actualiza el formulario si estás usando Reactive Forms
        this.miFormulario.patchValue({
          nombre: this.kitEditando.nombre,
          descripcion: this.kitEditando.descripcion,
          precio: this.kitEditando.precio,
          disponible: this.kitEditando.disponible
        });

        // Reconstruye JSON de categorías si lo necesitas
        this.kitJson = this.kitEditando.categoriasJson
          ? JSON.parse(this.kitEditando.categoriasJson)
          : { categorias: [], extras: [], precioFinal: null };
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar kit',
          detail: 'No se pudo obtener la información actualizada del kit'
        });
      }
    });
  }

  calcularDescuento() {
    if (this.kitEditando.descuento > 100) this.kitEditando.descuento = 100;
    if (this.kitEditando.descuento < 0) this.kitEditando.descuento = 0;

    this.kitEditando.preciocondescuento = this.kitEditando.precio - (this.kitEditando.precio * (this.kitEditando.descuento / 100) )

  }











}
