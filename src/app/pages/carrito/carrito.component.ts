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
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute } from '@angular/router';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-carrito',
  imports: [ButtonModule, TableModule, CommonModule, InputNumberModule, FormsModule, DialogModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  cartProducts: Product[] = [];
  cartItems: any[] = [];
  userId = localStorage.getItem("Id")
  newProduct = { name: '', description: '', price: null, quantity: 1 };
  mostrarModal: boolean = false;




  constructor(private messageService: MessageService, private cartService: ProductService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.loadCart();

    const cancelado = this.route.snapshot.queryParamMap.get("cancelado");
    console.log(cancelado)
    if (cancelado) {
      this.mostrarModal = true;
      this.cancelarPedido();
    }
  }

  loading: boolean = false;

  // Cargar el carrito del usuario
  loadCart() {
    this.cartService.getCart(localStorage.getItem("Id") ?? "").subscribe(data => {
      this.cartItems = data.map((item: { id: any; nombre: string; descripcion: string; precioUnitario: any; cantidad: any; }) => ({
        id: item.id,
        nombre: item.nombre, // ✅ Ahora usamos directamente el Nombre del producto o kit
        descripcion: item.descripcion, // ✅ Usamos la Descripción que viene en la respuesta
        precio: item.precioUnitario,
        cantidad: item.cantidad
      }));
    });
  }


  // Calcular el total del carrito
  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
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
      nombre: this.newProduct.name,
      descripcion: this.newProduct.description,
      precio: this.newProduct.price,
      cantidad: this.newProduct.quantity
    });

    this.newProduct = { name: '', description: '', price: null, quantity: 1 }; // Reiniciar formulario
  }

  async pagar() {
    this.loading = true;
    const total = this.getTotal();
    if(total < 100){
      this.messageService.add({ severity: 'info', summary: 'Agrega más articulos para continuar', detail: 'Compra minima de $100 pesos' });
      this.loading = false;
      return;
    }

    await this.guardarPedido();

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

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarPedido() {
    const total = this.getTotal();
    // Aquí puedes generar el JSON para guardar en la nueva tabla
    // const pedidoJson = {
    //   clienteId: this.userId, // reemplaza por el ID real del usuario
    //   fecha: new Date().toISOString(),
    //   total: total,
    //   productos: this.cartItems.map(item => ({
    //     name: item.name,
    //     quantity: item.quantity,
    //     subtotal: item.price * item.quantity
    //   }))
    // };

    // this.cartService.guardarPedido(pedidoJson).subscribe({
    //   next: res => console.log('Pedido guardado', res),
    //   error: err => console.error('Error al guardar pedido', err)
    // });



    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: "undefined",
      esSuscripcion: false,
      activa: true,
      pagado: false,
      nombreKit: "Compra Unica / Personalizada",
      productosJson: JSON.stringify(this.cartItems),
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "compra unica",
      total: this.getTotal(),
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: ""
    };
    console.log("objeto para back", suscripcion);

    this.cartService.RegistrarCompraSuscripcion(suscripcion).subscribe({
      next: data => {
        console.log("Compra/suscripción registrada correctamente:", data);

      },
      error: error => {
        if (error.status === 400) {
          console.error("Error de validación (BadRequest):", error.error);
          // Aquí podrías mostrar un mensaje al usuario con error.error.msg u otra propiedad
        } else {
          console.error("Otro error:", error);
        }
      },
      complete: () => {
        console.log("Petición completada");
      }
    })

    if (this.mostrarModal == true) {   //significa que fue cancelado 
      //si fue cancelado entonces se borra el ultimo pedido que guardo el usuario en la base de datos
      console.log("entro a true");
    } else {
      //si fue exitoso se vacia su carrito
      this.cartService.clearCart(localStorage.getItem("Id") ?? '').subscribe();
    }

  }

  cancelarPedido() {
    this.cartService.cancelarPedido(localStorage.getItem("Id") ?? '').subscribe(
      {
        next: data => {

        }
      }
    );
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
