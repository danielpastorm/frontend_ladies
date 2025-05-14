import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ProductService } from '../../../services/product.service';
import { Message } from 'primeng/message';
import { ActivatedRoute } from '@angular/router';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, Tag, ToastModule],
  providers: [MessageService],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {
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

  getSeverity(obj: any) {
    console.log(obj)
    if (obj.cancelada) {
      return 'danger'
    }
    else if (obj.esSuscripcion && obj.activa == obj.pagado) {
      return 'success'
    } else if (!obj.esSuscripcion && !obj.pagado) {
      return 'warn'
    }
    return 'info'

  }

  getText(obj: any) {
    if (obj.cancelada) {
      return 'Cancelada'
    }
    if (obj.esSuscripcion && obj.activa == obj.pagado) {
      return 'Activa y Pagada'
    }
    else if (!obj.esSuscripcion && !obj.pagado) {
      return 'No pagada'
    } else if (!obj.esSuscripcion && obj.pagado) {
      return 'Compra Pagada'
    }
    return 'N/A'
  }


}

// onRowExpand(event: TableRowExpandEvent) {
//   this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
// }

// onRowCollapse(event: TableRowCollapseEvent) {
//   this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
// }


