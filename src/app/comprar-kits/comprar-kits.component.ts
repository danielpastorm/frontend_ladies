import { Component } from '@angular/core';
import { Kit, OpcionSeleccion, ProductoEstatico } from '../Data/KitsModel';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-comprar-kits',
  imports: [ReactiveFormsModule, DropdownModule, CommonModule, FloatLabel, InputTextModule, InputNumber, Fluid, ButtonModule,
    FormsModule, DividerModule, TextareaModule, InputTextModule, CardModule, ToastModule, FileUploadModule],
  templateUrl: './comprar-kits.component.html',
  styleUrl: './comprar-kits.component.css'
})
export class ComprarKitsComponent {
  kitForm!: FormGroup;
  productosEstaticos: ProductoEstatico[] = [];
  opcionesSeleccion: OpcionSeleccion[] = [];
  catalogoProductos: any[] = []; // cargar con tus productos desde la API
  apiUrl: string = environment.apiUrl;
  imageUrl: string = this.apiUrl + 'Images/AgregarImagenesKit/-1';

  constructor(private fb: FormBuilder, private kitService: ProductService, private messageService: MessageService) { }

  ngOnInit() {
    this.kitForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [0, Validators.required],
      descuento: [0],
      imagenes: ['']
    });

    this.kitService.getProducts().subscribe(res => {
      this.catalogoProductos = res.map((p: any) => ({
        id: p.id,
        nombre: p.nombre
      }));
    });
  }

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

  guardarKit() {
    const nuevoKit = {
      id: 0, // obligatorio aunque se ignore
      nombre: this.kitForm.value.nombre,
      descripcion: this.kitForm.value.descripcion,
      precio: this.kitForm.value.precio,
      descuento: this.kitForm.value.descuento,
      imagenes: this.kitForm.value.imagenes,

      productosEstaticos: this.productosEstaticos.map(p => ({
        id: 0,
        kitId: 0,
        productoId: p.IdProducto,
        cantidad: p.Cantidad
      })),

      opcionesSeleccion: this.opcionesSeleccion.map((opcion, i) => ({
        id: 0,
        kitId: 0,
        titulo: opcion.titulo,
        orden: opcion.orden,
        productos: opcion.productos.map(prod => ({
          id: 0,
          opcionSeleccionId: 0,
          productoId: prod.ProductoId,
          cantidad: prod.Cantidad
        }))
      }))
    };


    console.log(nuevoKit);

    this.kitService.crearKit(nuevoKit).subscribe(res => {
      console.log('Kit creado:', res);
    });
  }



  uploadedFiles: any[] = [];
  onUpload(event: FileUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }


}
