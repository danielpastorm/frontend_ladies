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
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compras-admin',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, Message, DropdownModule, FormsModule, ConfirmDialogModule, CalendarModule,
    TableModule, InputTextModule, Tag, IconField, InputIcon, ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './compras-admin.component.html',
  styleUrl: './compras-admin.component.css'
})
export class ComprasAdminComponent {
  userId = localStorage.getItem("Id") ?? "";
  compras: any[] = [];
  mostrarModal = false;
  products: any[] = [];
  apiUrl = environment.apiUrl;
  defaultImage = this.apiUrl + "uploads/resources/final-3.png";


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {


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

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'Premium':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'danger'
    }
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


}
