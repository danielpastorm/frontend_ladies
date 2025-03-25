import { Component, input } from '@angular/core';
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

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-crear',
  imports: [ReactiveFormsModule, Button, FileUpload, DropdownModule, Card,
    InputIcon,
    IconField,
    InputTextModule,
    FormsModule,
    ToggleButtonModule,
    InputNumber, ButtonModule, CommonModule, BadgeModule, Badge, ProgressBar, ToastModule
  ],
  providers: [ProductService],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent {
  //archivos
  uploadedFiles: any[] = [];

  //demas 


  images: string[] = [];



  checked: boolean = false;

  productForm!: FormGroup;
  selectedImages: string[] = [];

  // Ejemplo de categorías
  categories = [
    { label: 'Categoría 1', value: 'cat1' },
    { label: 'Categoría 2', value: 'cat2' },
    { label: 'Categoría 3', value: 'cat3' },
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService, private productService: ProductService) { }

  ngOnInit(): void {
    // Definimos el formulario reactivo
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      disponible: [false],
      precio: [null, Validators.required],
    });
    const sampleImage = 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=600';

    // Agregamos la misma imagen 10 veces al array
    for (let i = 0; i < 10; i++) {
      this.images.push(sampleImage);
    }

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

      // Llama al servicio para crear el producto y se suscribe a la respuesta
      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          console.log('Producto creado:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Producto creado',
            detail: 'El producto ha sido creado correctamente.'
          });
          // Reinicia el formulario e imágenes
          this.productForm.reset();
          this.selectedImages = [];
        },
        error: (error: any) => {
          console.error('Error al crear el producto:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el producto.'
          });
        }
      });
    } else {
      // Marca los campos como tocados para mostrar los errores
      this.productForm.markAllAsTouched();
      console.log("error");
      
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, complete todos los campos obligatorios.'
      });
    }
  }
}
