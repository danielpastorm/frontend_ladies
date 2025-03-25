import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Message } from 'primeng/message'
import { ProductService } from '../../services/product.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-compras-admin',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, Message, DropdownModule, FormsModule, ConfirmDialogModule, CalendarModule],
  providers: [ConfirmationService],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css'
})
export class ComprasAdminComponent {
  @ViewChild('dt') dt!: Table;

  userId = "123"
  compras: any[] = [];
  detalleVisible = false;
  compraSeleccionada: any = null;
  estadosDisponibles: string[] = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];

  constructor(private productService: ProductService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.productService.obtenerTodosLosPedidos().subscribe({
      next: data => {
        this.compras = data.map(p => ({
          ...p,
          fecha: new Date(p.fecha).toLocaleDateString('es-MX'), // ✅ se transforma la fecha
          productos: JSON.parse(p.productos).map((item: any) => ({
            nombre: item.Name,
            cantidad: item.Quantity,
            precio: item.Subtotal
          }))
        }));
      },
      error: err => console.error('Error al cargar pedidos del admin', err)
    });
  }
  


  verDetalles(compra: any) {
    this.compraSeleccionada = compra;
    console.log(this.compraSeleccionada)
    this.detalleVisible = true;
  }

  getStatusSeverity(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'warn';
      case 'enviado': return 'info';
      case 'entregado': return 'success';
      case 'cancelado': return 'error';
      default: return 'secondary';
    }
  }

  actualizarEstado() {
    if (!this.compraSeleccionada) return;
    
    const dto = {
      NuevoEstado: String =  this.compraSeleccionada.estado,
      Guia: String =  this.compraSeleccionada.guia || ''
    };
    console.log(dto)
  
    this.productService.cambiarEstadoPedido(this.compraSeleccionada?.id, dto)
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Estado actualizado' });
          this.detalleVisible = false;
          // Opcional: volver a cargar la tabla si lo necesitas
          this.ngOnInit();
        },
        error: err => {
          console.error('Error al actualizar estado', err);
          this.messageService.add({ severity: 'error', summary: 'Error al actualizar' });
        }
      });
  }

  filtrarPorFecha(fecha: Date) {
    const fechaFormateada = fecha.toLocaleDateString('es-MX'); // "21/03/2025"
    this.dt.filter(fechaFormateada, 'fecha', 'equals');
  }
  
  

  confirmarCambioEstado() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de cambiar el estado del pedido?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.actualizarEstado();
      }
    });
  }
  

  limpiarFiltros() {
    this.dt.clear(); // 🔄 Limpia todos los filtros aplicados
  }
  

}
