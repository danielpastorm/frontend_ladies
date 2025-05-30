import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message'
import { ProductService } from '../../services/product.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MenuItem, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { TieredMenu } from 'primeng/tieredmenu';
import { SpeedDial } from 'primeng/speeddial';
import { SelectButton } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, map, Observable, of } from 'rxjs';
import { UsuariosComponent } from '../usuarios/usuarios/usuarios.component';


export interface Usuario {
  idStripe: string;
  id: string;
  nombre: string;
}







@Component({
  selector: 'app-compras-admin',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, Message, DropdownModule, FormsModule, ConfirmDialogModule, CalendarModule,
    TableModule, InputTextModule, Tag, IconField, InputIcon, ToastModule, SpeedDial, ButtonModule, InputTextModule, SelectButton,
    SelectModule, FloatLabel
  ],
  providers: [ConfirmationService],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css'
})
export class ComprasAdminComponent {
  usuarios: Usuario[] = [];

  userId = localStorage.getItem("Id") ?? "";
  compras: any[] = [];
  mostrarModal = false;
  products: any[] = [];
  apiUrl = environment.apiUrl;
  defaultImage = this.apiUrl + "uploads/resources/final-3.png";
  NotasAdmin: string = ""

  value: any;
  mostrarInput: boolean = false;
  textoInput: string = '';

  opcionSeleccionada: string = '';
  stateOptions = [
    { name: 'Cancelada', code: 'Cancelada' },
    { name: 'Preparando', code: 'Preparando' },
    { name: 'Enviada', code: 'Enviada' },
    { name: 'Entregada', code: 'Entregada' }
  ];



  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private AuthService: AuthService
  ) { }

  ngOnInit() {

    this.productService.getUsersList().subscribe(
      data => {
        this.usuarios = data;
        console.log(data);
      }
    )




    this.productService.obtenerPedidosPorCliente(this.userId).subscribe({
      next: (data) => {
        this.products = data.map(pedido => ({
          ...pedido,
          productos: typeof pedido.productosJson === 'string'
            ? JSON.parse(pedido.productosJson)
            : pedido.productosJson
        }));

        console.log('Products:', this.products);
      },
      error: (err) => console.error('Error al cargar compras', err)
    });

    const mostrar = this.route.snapshot.queryParamMap.get("session_id");
    if (mostrar) {
      this.mostrarModal = true;
    }
  }






  expandedRows = {};


  expandAll() {
    this.expandedRows = this.products.reduce((acc, product) => {
      acc[product.id] = true;
      return acc;
    }, {});
  }



  collapseAll() {
    this.expandedRows = {};
  }

  getSeverity(product: any) {
    // switch (status) {
    //   case 'INSTOCK':
    //     return 'success';
    //   case 'Premium':
    //     return 'warn';
    //   case 'OUTOFSTOCK':
    //     return 'danger';
    //   default:
    //     return 'danger'
    // }

    if (product.estatus == "Pendiente") {
      return 'info';
    }
    if (product.cancelada) {
      return 'danger'
    }
    if (product.notasAdmin == "Entregada") {
      return 'success'
    }
    if (product.notasAdmin == "Preparando") {
      return 'warn'
    }
    return 'contrast'
  }

  getStatusSeverity(status: string) {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'danger';
    }

  }

  // onRowExpand(event: TableRowExpandEvent) {
  //   this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
  // }

  // onRowCollapse(event: TableRowCollapseEvent) {
  //   this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
  // }


  cambiarEstatus(product: any) {

    console.log("llego con estatus: ", product.enviada)
    console.log("Notas admin: ", product.notasAdmin)

    product.enviada = true
    product.notasAdmin = "aqui va la guia"




    console.log("se fue con estatus: ", product.enviada)
    console.log("se fue con Notas admin: ", product.notasAdmin)

  }


  modalCambioVisible: boolean = false;
  productoSeleccionado: any = null;
  nuevoEstatus: string = '';
  guiaEnvio: string = '';

  estatusOptions = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Enviado', value: 'Enviado' },
    { label: 'Entregado', value: 'Entregado' },
    { label: 'Cancelado', value: 'Cancelado' }
  ];

  abrirCambioEstatus(producto: any) {
    this.productoSeleccionado = producto;
    this.nuevoEstatus = producto.estado; // o el campo que tengas
    this.guiaEnvio = producto.guia || '';
    this.modalCambioVisible = true;
  }

  cerrarModalCambio() {
    this.modalCambioVisible = false;
    this.productoSeleccionado = null;
    this.nuevoEstatus = '';
    this.guiaEnvio = '';
  }

  guardarCambioEstatus() {
    if (this.nuevoEstatus === 'Enviado' && !this.guiaEnvio.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Guía requerida', detail: 'Debes ingresar una guía de envío.' });
      return;
    }

    // Aquí haces el PATCH o POST al servidor para guardar el cambio
    console.log('Nuevo estatus:', this.nuevoEstatus);
    console.log('Guía de envío:', this.guiaEnvio);

    // Por ejemplo:
    // this.productService.cambiarEstado(productoSeleccionado.id, nuevoEstatus, guiaEnvio).subscribe(...)

    this.modalCambioVisible = false;
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Estatus actualizado correctamente.' });
  }




  handleChange(event: any) {
    console.log('Valor seleccionado:', this.value);

    if (this.value == null) {
      console.log("debes seleccionar un estado, el valor actual no fue cambiado")
      return;
    }

    if (this.value === 'Pendiente') {
      console.log("Cambiando estatus pendiende al id", this.productoSeleccionado.id)
    }

    if (this.value === 'Enviado') {
      // Si selecciona "Enviado", mostrar input para pedir guía
      this.mostrarInput = true;
    } else {
      // Si no, ocultarlo y guardar directo si quieres
      this.mostrarInput = false;
      this.guardarCambio(); // O puedes esperar confirmación del usuario
    }
  }

  guardarCambio() {


    switch (this.opcionSeleccionada) {
      case "Cancelada":
        this.cancelar();
        break;
      case "Preparando":
        this.preparando();
        break;
      case "Enviada":
        this.enviada();
        break;
      case "Entregada":
        this.entregada();
        break;
      default:
        console.log("Aqui va una alerta");
    }

  }

  cancelar() {
    const CambioStatusDTO = {
      Id: this.productoSeleccionado.id,
      Enviada: false,
      Cancelada: true,
      MotivoCancelacion: "Cancelada", //este sera como el estatus
      NotasAdmin: this.NotasAdmin
    }

    this.productService.cambiarEstadoPedido(CambioStatusDTO).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Se actualizó correctamente',
        });
        this.actualizarUI();

      },
      error: (error) => {
        console.error('Ocurrió un error', error.status);
      }
    });


  }
  preparando() {
    const CambioStatusDTO = {
      Id: this.productoSeleccionado.id,
      Enviada: false,
      Cancelada: false,
      MotivoCancelacion: "Preparando",
      NotasAdmin: "Preparando"
    }

    this.productService.cambiarEstadoPedido(CambioStatusDTO).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Se actualizó correctamente',
        });
        this.actualizarUI();

      },
      error: (error) => {
        console.error('Ocurrió un error', error.status);
      }
    });

  }
  enviada() {
    const CambioStatusDTO = {
      Id: this.productoSeleccionado.id,
      Enviada: true,
      Cancelada: false,
      MotivoCancelacion: "Enviada",
      NotasAdmin: this.textoInput
    }

    this.productService.cambiarEstadoPedido(CambioStatusDTO).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Se actualizó correctamente',
        });
        this.actualizarUI();

      },
      error: (error) => {
        console.error('Ocurrió un error', error.status);
      }
    });

  }
  entregada() {
    const CambioStatusDTO = {
      Id: this.productoSeleccionado.id,
      Enviada: false,
      Cancelada: false,
      MotivoCancelacion: "Entregada",
      NotasAdmin: "Entregada"
    }

    this.productService.cambiarEstadoPedido(CambioStatusDTO).subscribe({
      next: (response) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Se actualizó correctamente',
        });
        this.actualizarUI();
      },
      error: (error) => {
        console.error('Ocurrió un error', error.status);
      }
    });

  }

  actualizarUI() {
    this.productService.obtenerPedidosPorCliente(this.userId).subscribe({
      next: (data) => {
        this.products = data.map(pedido => ({
          ...pedido,
          productos: typeof pedido.productosJson === 'string'
            ? JSON.parse(pedido.productosJson)
            : pedido.productosJson
        }));

        console.log('Products:', this.products);
      },
      error: (err) => console.error('Error al cargar compras', err)
    });

    this.modalCambioVisible = false;


  }


  abrirInfoB: boolean = false;
  data: any;

  abrirInfo(product: any) {
    this.abrirInfoB = true;
    this.productService.obtenerClienteInfo(product.idUsuario).subscribe({
      next: data => {
        this.data = data;
        console.log("se cargo perfil", this.data)
      }
    })
  }





  getTextcontent(product: any): string {
    if (product.estatus == "Pendiente") {
      return 'Pendiente';
    }
    if (product.cancelada) {
      return 'Cancelada'
    }
    if (product.notasAdmin == "Entregada") {
      return 'Entregada'
    }
    if (product.notasAdmin == "Preparando") {
      return 'Preparando'
    }
    if (!product.esSuscripcion && product.pagado) {
      return 'Compra Pagada'
    }
    return 'Estatus no encontrado'

  }


  getNombre(id: string): string {
    var nombre = this.usuarios.find(q => q.id == id)?.nombre;
    return nombre ?? '';
  }

  getId(id: string): string {
    var nombre = this.usuarios.find(q => q.id == id)?.idStripe;
    return nombre ?? '';
  }



}




