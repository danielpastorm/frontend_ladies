import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductService } from '../../../services/product.service';
import { Message } from 'primeng/message';

interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface Compra {
  fecha: string;
  total: number;
  estado: string;
  productos: Producto[];
}

@Component({
  selector: 'app-compras',
  imports: [CommonModule, DialogModule, ButtonModule, TableModule, Message],
  providers:[],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent {

  userId = localStorage.getItem("Id") ?? ""
  compras: any[] = [];
  detalleVisible = false;
  compraSeleccionada: any = null;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.obtenerPedidosPorCliente(this.userId).subscribe({
      next: data => {
        // Mapear todos los pedidos, deserializando los productos
        this.compras = data.map(p => ({
          ...p,
          productos: JSON.parse(p.productos)
        }));
        console.log("compras" ,this.compras)
      },
      error: err => console.error('Error al cargar compras', err)
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
  
}
