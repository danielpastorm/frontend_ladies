import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from '../../Data/productoCart.types';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [ButtonModule, TableModule, CommonModule, InputNumberModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  cartProducts: Product[] = [];
  cartItems: any[] = [];
  userId = localStorage.getItem("Id")
  newProduct = { name: '', description: '', price: null, quantity: 1 };




  constructor(private messageService: MessageService, private cartService: ProductService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.loadCart();

  }

  loading: boolean = false;

  // Cargar el carrito del usuario
  loadCart() {
    this.cartService.getCart(localStorage.getItem("Id") ?? "").subscribe(data => {
      this.cartItems = data.map((item: { id: any; nombre: string; descripcion: string; precioUnitario: any; cantidad: any; }) => ({
        id: item.id,
        name: item.nombre, // ✅ Ahora usamos directamente el Nombre del producto o kit
        description: item.descripcion, // ✅ Usamos la Descripción que viene en la respuesta
        price: item.precioUnitario,
        quantity: item.cantidad
      }));
    });
  }


  // Calcular el total del carrito
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Modificar la cantidad de un producto en el carrito
  updateQuantity(product: any, newQuantity: number) {
    if (newQuantity < 1) return;
    product.quantity = newQuantity;
  }

  // Eliminar un producto del carrito
  removeProduct(product: any) {
    this.cartItems = this.cartItems.filter(item => item.id !== product.id);
  }

  // Agregar un nuevo producto manualmente
  addProduct() {
    if (!this.newProduct.name || !this.newProduct.price || this.newProduct.quantity < 1) return;

    this.cartItems.push({
      id: Math.random().toString(36).substr(2, 9), // ID temporal
      name: this.newProduct.name,
      description: this.newProduct.description,
      price: this.newProduct.price,
      quantity: this.newProduct.quantity
    });

    this.newProduct = { name: '', description: '', price: null, quantity: 1 }; // Reiniciar formulario
  }

  pagar() {
    this.loading = true;
    const total = this.getTotal();
    this.auth.pay(total).subscribe({
      next: (response) => {
        console.log("Pago exitoso:", response)
        this.loading = false;
      },
      error: (error) => {
        console.error("Error en el pago:", error)
        this.loading = false;
      }
    });
  }

  navigateToProductos() {
    this.router.navigate(['/Kits']);
  }


  // pagar() {
  //   const total = this.getTotal();

  //   // Armar el mensaje sin íconos que puedan romper la URI
  //   let message = 'Hola, soy '+ localStorage.getItem("nombre")  + '! Me interesa comprar los siguientes productos:%0A';

  //   this.cartItems.forEach(item => {
  //     message += `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}%0A`;
  //   });

  //   message += `%0ATotal: $${total.toFixed(2)}`;
  //   console.log(message);

  //   const phoneNumber = '525613592002'; // Número de WhatsApp (sin + ni espacios)
  //   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  //   // Enviar a WhatsApp
  //   window.open(whatsappUrl, '_blank');

  //   // Aquí puedes generar el JSON para guardar en la nueva tabla
  //   const pedidoJson = {
  //     clienteId: this.userId, // reemplaza por el ID real del usuario
  //     fecha: new Date().toISOString(),
  //     total: total,
  //     productos: this.cartItems.map(item => ({
  //       name: item.name,
  //       quantity: item.quantity,
  //       subtotal: item.price * item.quantity
  //     }))
  //   };

  //   console.log(pedidoJson)
  //   // Enviar al backend (si ya tienes un endpoint configurado)
  //   this.cartService.guardarPedido(pedidoJson).subscribe({
  //     next: res => console.log('Pedido guardado', res),
  //     error: err => console.error('Error al guardar pedido', err)
  //   });

  //   this.cartService.clearCart(localStorage.getItem("Id") ?? '').subscribe();
  // }






}
