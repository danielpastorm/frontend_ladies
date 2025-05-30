import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { DynamicSubscriptionRequest, ProductService } from '../../../services/product.service';
import { Dialog } from 'primeng/dialog';
import { CompraUnica, Producto } from '../../../Data/producto.types';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { GalleriaModule } from 'primeng/galleria';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';  // <-- Importa FormsModule
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CarouselModule } from 'primeng/carousel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { AuthService } from '../../../services/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { environment } from '../../../../environments/environment';
import { retry } from 'rxjs';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-nuestros-productos',
  standalone: true,
  imports: [
    BadgeModule, RippleModule, ToastModule, FormsModule, DialogModule,
    ButtonModule, DrawerModule, InputGroupModule, InputGroupAddonModule, InputTextModule,
    InputNumberModule, FloatLabelModule, CarouselModule, ToggleButtonModule, DropdownModule,
    ProgressSpinnerModule, GalleriaModule, TableModule, RatingModule, CommonModule, DataViewModule,
    CardModule, Dialog, AvatarModule, OverlayBadgeModule, ChipModule
  ],
  templateUrl: './nuestros-productos.component.html',
  styleUrl: './nuestros-productos.component.css',

})


export class NuestrosProductosComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  logoUrl: string = this.apiUrl + "uploads/resources/logo.png"

  selectedProduct!: Producto;

  products: any[] = [];
  sortField: string = 'precio';
  sortOrder: number = 1;
  sortOptions = [
    { label: 'Precio: Menor a Mayor', value: 'precio' },
    { label: 'Precio: Mayor a Menor', value: '!precio' }
  ];
  sortKey: string = 'precio';

  loading: boolean = false;
  purchasing: boolean = false;

  deletingImageIndex: number = -1;

  visible: boolean = false;

  uploadedFiles: any[] = [];
  cargando: boolean = true;
  customerId: string = "";





  displayEditModal: boolean = false;

  mostrar_kit_personalizado: boolean = false;

  IdStripe: string = "";
  ////////////////
  kits: any[] = [];
  productosCatalogo: any[] = [];

  kitSeleccionado: any = null;
  mostrarModal = false;
  mostrarConfirmacion = false;
  productosExtras: number[] = [];

  productos: any[] = [];

  // Variables para productos extras (arreglo de IDs) y para guardar la cantidad seleccionada para cada extra
  extrasCantidad: { [key: number]: number } = {};

  kit_personalizado: any;

  stripePromise: Promise<Stripe | null> = loadStripe('pk_live_51RRyFMACQSfwd7DO637d26RxjRuAkJT13ZJGKxVROLvmbFTP3tIUqtfBg191GBMwbnbZyVKvTp7NfLyWFoLYUPWn00gZBV7rQ2');



  constructor(private http: HttpClient, private productService: ProductService, private messageService: MessageService, private cartService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cargando = true;
    this.obtenerProductos();
    this.setIdStripe();
    this.obtenerKits();
  }

  setIdStripe() {
    this.authService.getCustomerIdStripe(localStorage.getItem("Id") ?? '').subscribe({
      next: data => {
        const id = data.replace(/"/g, '');
        this.IdStripe = id;
      }
    })
  }

  obtenerProductos() {
    this.productService.getProducts().subscribe(data => {
      this.productos = data.filter(q => q.id != 5);
      console.log('Productos cargados:', this.productos);
    });
  }

  obtenerKits() {
    this.productService.getKits().subscribe(data => {
      this.productosCatalogo = data;

      this.kits = this.productosCatalogo.map(kit => {
        const categorias = kit.categoriasJson ? JSON.parse(kit.categoriasJson).categorias : [];
        return {
          ...kit,
          imagenesArray: kit.imagenes?.split(';') || [],
          categorias
        };
      });

      
      this.cargando = false;

      console.log('Kits procesados:', this.kits);
    });
  }

  obtenerUrlImagen(id: number, nombreImagen: string): string {
    return `${this.apiUrl}uploads/kit_${id}/${nombreImagen}`;
  }


  precioBase: number = 0;
  seleccionarKit(kit: any) {

    this.kitSeleccionado = JSON.parse(JSON.stringify(kit)); // copia profunda
    console.log("seleccionar kit", this.kitSeleccionado)
    this.precioBase = this.kitSeleccionado.precio;
    this.productosExtras = [];
    this.mostrarModal = true;
  }

  getNombreProducto(id: number): string {
    return this.productosCatalogo.find(p => p.id === id)?.nombre || `ID ${id}`;
  }

  getImagenProducto(prod: any, esExtra: boolean): string {
    const url: string = environment.apiUrl;
    if (esExtra) {
      const firstImage = prod.imagenes.split(';')[0].trim(); // Obtiene la primera imagen y elimina espacios
      return url + 'uploads/' + prod.id + '/' + firstImage;
    }

    const imagen = this.productos.find(p => p.id === prod)?.imagenes.split(';')[0].trim();
    return url + 'uploads/' + prod + '/' + imagen;



  }

  get tieneAlMenosUnProductoSeleccionado(): boolean {
    return this.kitSeleccionado.categorias?.some((c: { idProductoSeleccionado: null; }) => c.idProductoSeleccionado != null);
  }


  agregarExtra(prodId: number): void {
    if (!this.productosExtras.includes(prodId)) {
      this.productosExtras.push(prodId);
      // Actualizamos el precio final al agregar un extra
      this.actualizarPrecioFinal();
    }
  }

  agregarExtraPersonalizado(prodId: number): void {
    if (!this.productosExtras.includes(prodId)) {
      this.productosExtras.push(prodId);

      // Transformamos productosExtras en un arreglo de objetos con id y cantidad predeterminada 1
      this.kit_personalizado.extras = this.productosExtras.map(id => ({
        id: id,
        cantidad: 1
      }));



      this.kit_personalizado.precioFinal = this.calcularTotalExtras(this.kit_personalizado.extras);
      console.log("Kit personalizado actualizado:", this.kit_personalizado);

    }
  }

  quitarExtraPersonalizado(prodId: number): void {
    const index = this.productosExtras.indexOf(prodId);
    if (index !== -1) {
      // Elimina 1 elemento en la posición "index"
      this.productosExtras.splice(index, 1);
      console.log("productosExtras tras eliminar:", this.productosExtras);

      // Actualiza el arreglo de extras en kit_personalizado,
      // asignando para cada extra la cantidad (por ejemplo, 1 o la que hayas registrado en extrasCantidad)
      this.kit_personalizado.extras = this.productosExtras.map(id => ({
        id: id,
        cantidad: this.extrasCantidad[id] || 1  // Asegúrate de que extrasCantidad tenga la cantidad deseada
      }));

      // Recalcular el precio final usando la función que hayas definido
      this.kit_personalizado.precioFinal = this.calcularTotalExtras(this.kit_personalizado.extras);
      console.log("Kit personalizado actualizado:", this.kit_personalizado);
    }
  }

  quitarExtra(prodId: number): void {
    this.productosExtras = this.productosExtras.filter(id => id !== prodId);
    // Actualizamos el precio final al quitar un extra
    console.log(this.productosExtras)
    this.actualizarPrecioFinal();
  }

  calcularTotalExtras(extras: { id: number, cantidad: number }[]): number {
    let total = 0;

    // Recorremos cada extra
    extras.forEach(extra => {
      // Buscar en el catálogo el producto con el id correspondiente
      const producto = this.productos.find(p => p.id === extra.id);
      if (producto && producto.precio) {
        total += producto.precio * extra.cantidad;
      }
    });

    return total;
  }



  _precio: number = 0;
  actualizarPrecioFinal(): void {
    // Parseamos el JSON actual del kit
    let kitData: any = { categorias: [], extras: [], precioFinal: null };
    const precioBase = this.precioBase || 0;

    if (this._precio == 0) {
      this._precio = this.kitSeleccionado.precio || 0;
    }
    if (this.kitSeleccionado.categoriasJson) {
      try {
        kitData = JSON.parse(this.kitSeleccionado.categoriasJson);
      } catch (error) {
        console.error("Error al parsear categoriasJson:", error);
      }
    }

    // Calcular el total de precio de los extras y preparar la lista de objetos para extras
    let precioExtras = 0;
    const extrasProductos: any[] = [];

    this.productosExtras.forEach(prodId => {
      // Buscar en el catálogo el producto extra seleccionado
      const prod = this.productos.find(p => p.id === prodId);
      console.log("productos", prod)
      if (prod && prod.precio) {
        precioExtras += prod.precio;
        extrasProductos.push({ id: prodId, cantidad: 1 });
      } else {
        this._precio = 0;
        precioExtras = 0;
      }
    });

    // Asegurarse de que kitData.categorias es un arreglo
    if (!kitData.categorias || !Array.isArray(kitData.categorias)) {
      kitData.categorias = [];
    }

    // Buscar la categoría "Extras" (ignorar mayúsculas)
    let extrasCategory = kitData.categorias.find((cat: any) => cat.nombre && cat.nombre.toLowerCase() === "extras");

    if (!extrasCategory) {
      // Si no existe, crearla e incorporarla al arreglo de categorías
      extrasCategory = {
        nombre: "extras",
        productos: extrasProductos
      };
      kitData.categorias.push(extrasCategory);
    } else {
      // Si ya existe, actualizar sus productos
      extrasCategory.productos = extrasProductos;
    }

    // Opcional: también se puede asignar el arreglo de extras de forma directa
    kitData.extras = this.productosExtras.map(prodId => ({
      id: prodId,
      cantidad: this.extrasCantidad[prodId] || 1
    }));


    // Calcular el precio final: precio base del kit + total de extras
    kitData.precioFinal = precioBase + precioExtras;
    console.log("precio base: ", precioBase)
    console.log("precio extra: ", precioExtras)

    // Actualizar el JSON del kit con la información nueva
    this.kitSeleccionado.categoriasJson = JSON.stringify(kitData);
    this.kitSeleccionado.precio = this._precio + precioExtras;
    console.log("Kit actualizado con extras y precio final:", this.kitSeleccionado);
  }

  confirmarSeleccion(): void {
    // Parsear el JSON existente en el kit (si existe)
    let categoriasObj: any = {};
    if (this.kitSeleccionado.categoriasJson) {
      try {
        categoriasObj = JSON.parse(this.kitSeleccionado.categoriasJson);
      } catch (error) {
        console.error("Error al parsear categoriasJson:", error);
      }
    }

    // Asignar el arreglo de extras seleccionados
    categoriasObj.extras = this.productosExtras;

    // Calcular el precio final: precio base del kit + suma de precios de cada extra seleccionado
    const precioBase = this.kitSeleccionado.precio || 0;
    let precioExtras = 0;
    this.productosExtras.forEach(prodId => {
      // Busca en productosCatalogo el producto extra por su ID
      const prod = this.productosCatalogo.find(p => p.id === prodId);
      if (prod && prod.precio) {
        precioExtras += prod.precio;
      }
    });
    categoriasObj.precioFinal = precioBase + precioExtras;

    // Actualizar el JSON del kit con la información nueva
    this.kitSeleccionado.categoriasJson = JSON.stringify(categoriasObj);

    console.log("Kit personalizado con extras y precio final:", this.kitSeleccionado);

    // Cerrar el modal y continuar con la lógica (por ejemplo, agregar el kit al carrito)
    this.mostrarModal = false;
  }





  getFirstImage(images: string): string {
    if (!images) return ''; // Verifica que no sea undefined o vacío

    const firstImage = images.split(';')[0].trim(); // Obtiene la primera imagen y elimina espacios
    return decodeURIComponent(firstImage); // Decodifica caracteres especiales como %20
  }



  getKitImages(imagenes: string): string[] {
    if (!imagenes) {
      console.log("vacio");

      return [];
    }
    // Asume que las imágenes se almacenan separadas por ";".
    console.log(imagenes.split(';').filter(img => img.trim().length > 0));

    return imagenes.split(';').filter(img => img.trim().length > 0);
  }


  onUpload(event: any): void {
    // Agregar los archivos a tu array, si lo requieres
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    // Obtener la respuesta del servidor, asumiendo que se encuentra en event.xhr.responseText o response
    const responseText = event.xhr && event.xhr.response ? event.xhr.response : 'Las imágenes fueron agregadas correctamente.';

    // Mostrar el mensaje usando el MessageService
    this.messageService.add({
      severity: 'info',
      summary: 'Archivos subidos',
      detail: responseText
    });
  }



  addKitToCart(kit: any) {
    return //deshabilitada
    const cartItem = {
      userId: localStorage.getItem("Id"),
      productoId: null, // Es un kit, no un producto individual
      kitId: kit.id,
      cantidad: 1, // Se puede modificar si el usuario selecciona una cantidad mayor
      precioUnitario: kit.precio, // Precio total del kit
      Descripcion: ""
    };
    const kitg = this.generarObjetoKitPersonalizado();
    this.kit_personalizado = kitg;
    this.mostrarModal = false;
    this.mostrarConfirmacion = true;
    return

    this.cartService.addToCart(cartItem).subscribe(() => {
      console.log("Kit agregado al carrito:", kit);
      this.messageService.add({
        severity: 'success',
        summary: 'Kit agregado correctamente',
        detail: 'se agrego el kit a tu carrito'
      });
    }, error => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo agregar' + error
      });
    });
  }


  getOpcionesProductos(categoria: any): any[] {
    console.log("categoria", categoria)
    return categoria.productos.map((p: any) => ({
      label: this.getNombreProductos(p.id),
      value: p.id
    }));
  }

  getNombreProductos(id: number): string {
    const p = this.productos.find(prod => prod.id === id);
    return p?.nombre || `Producto ID: ${id}`;
  }

  nombre: string = "";
  precio: number = 0;
  subscribe(nombre: string, precio: number) {
    // Mostrar indicador de carga (opcional)
    this.nombre = nombre;
    this.precio = precio;

    const kitg = this.generarObjetoKitPersonalizado();
    this.kit_personalizado = kitg;

    this.mostrarModal = false;
    this.mostrarConfirmacion = true;

  }


  trySuscribe() {
    this.loading = true;
    let kit = undefined;

    if (this.kit_personalizado != undefined) {
      console.log("kit_personalizado:", this.kit_personalizado);
      kit = this.kit_personalizado;
    } else {
      console.log("kitSeleccionado:", this.kitSeleccionado)
      kit = this.kitSeleccionado;
    }

    kit = this.kitSeleccionado;

    const id = this.IdStripe.replace(/"/g, '');

    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: id,
      esSuscripcion: true,
      activa: true,
      pagado: false,
      nombreKit: kit.nombre,
      productosJson: kit.categoriasJson,
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "mensual",
      total: kit.precio ? kit.precio : kit.precioFinal,
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: ""
    };
    console.log("suscrpcion ", suscripcion)


    this.productService.RegistrarCompraSuscripcion(suscripcion).subscribe({
      next: data => {
        console.log("Compra/suscripción registrada correctamente:", data);
      },
      error: error => {
        if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de validación' });
        }
      },
      complete: () => {
      }
    })

    const request: DynamicSubscriptionRequest = {
      CustomerId: this.IdStripe,
      Amount: this.precio * 100,
      Name: this.nombre
    };

    this.productService.listSubscriptions(this.IdStripe).subscribe({
      next: (suscripciones: any[]) => {
        const subsActivas = suscripciones.filter(sub => sub.status === 'active');
        if (subsActivas.length > 0) {
          this.messageService.add({ severity: 'warn', summary: 'Ya tienes una suscripción activa', detail: 'Cancela la actual antes de crear otra.' });
          this.loading = false
          return;
        }
        this.productService.createDynamicSubscription(request).subscribe({
          next: respuesta => {
            // Verifica que la respuesta tenga un sessionId válido
            if (!respuesta || !respuesta.sessionId) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se recibió sessionId en la respuesta.' });
              this.loading = false;
              return;
            }
            this.stripePromise.then(stripe => {
              if (stripe) {
                stripe.redirectToCheckout({ sessionId: respuesta.sessionId })
                  .then(result => {
                    if (result.error) {
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en redirectToCheckout' });
                    }
                  });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Stripe no se cargó correctamente.' });
                this.loading = false;
              }
            });
          },
          error: err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la suscripción' });
            this.loading = false;
          }
        });
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo verificar tus suscripciones.' });
      }
    });
  }




  suscribirse(obj: any) {

    this.loading = true;
    let kit = obj;

    const productosPersonalizados = kit.extras
      .filter((cat: { idProductoSeleccionado: null; }) => cat.idProductoSeleccionado != null)
      .map((cat: { idProductoSeleccionado: any; cantidadSeleccionada: any; }) => ({
        id: cat.idProductoSeleccionado,
        cantidad: cat.cantidadSeleccionada ?? 1
      }));

    const productosExtras = kit.extras.map((extra: { id: any; cantidad: any }) => ({
      id: extra.id,
      cantidad: extra.cantidad
    }));

    const compraUnica = {
      categorias: [
        {
          nombre: "Personalizado",
          productos: productosExtras
        }
      ],
      extras: productosExtras,
      precioFinal: kit.precioFinal ?? kit.precio
    };



    const id = this.IdStripe.replace(/"/g, '');

    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: id,
      esSuscripcion: true,
      activa: true,
      pagado: false,
      nombreKit: kit.nombre,
      productosJson: JSON.stringify(compraUnica),
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "mensual",
      total: kit.precio ? kit.precio : kit.precioFinal,
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: ""
    };
    console.log("suscrpcion ", suscripcion)
    


    this.productService.RegistrarCompraSuscripcion(suscripcion).subscribe({
      next: data => {
        console.log("Compra/suscripción registrada correctamente:", data);
      },
      error: error => {
        if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de validación' });
        }
      },
      complete: () => {
      }
    })



    const request: DynamicSubscriptionRequest = {
      CustomerId: this.IdStripe,
      Amount: obj.precioFinal * 100,
      Name: obj.nombre
    };

    console.log("Request", request)

    this.productService.listSubscriptions(this.IdStripe).subscribe({
      next: (suscripciones: any[]) => {
        const subsActivas = suscripciones.filter(sub => sub.status === 'active');
        if (subsActivas.length > 0) {
          this.messageService.add({ severity: 'warn', summary: 'Ya tienes una suscripción activa', detail: 'Cancela la actual antes de crear otra.' });
          this.loading = false
          return;
        }


        this.productService.createDynamicSubscription(request).subscribe({
          next: respuesta => {
            // Verifica que la respuesta tenga un sessionId válido
            if (!respuesta || !respuesta.sessionId) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se recibió sessionId en la respuesta.' });
              this.loading = false;
              return;
            }
            this.stripePromise.then(stripe => {
              if (stripe) {
                stripe.redirectToCheckout({ sessionId: respuesta.sessionId })
                  .then(result => {
                    if (result.error) {
                      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en redirectToCheckout' });
                    }
                  });
              } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Stripe no se cargó correctamente.' });
                this.loading = false;
              }
            });
          },
          error: err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la suscripción' });
            this.loading = false;
          }
        });
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo verificar tus suscripciones.' });
      }
    });
  }


  generarObjetoKitPersonalizado(): any {
    const kitPersonalizado: any = {
      kitId: this.kitSeleccionado.id,
      nombre: this.kitSeleccionado.nombre,
      descripcion: this.kitSeleccionado.descripcion,
      precioBase: this.precioBase,
      categorias: this.kitSeleccionado.categorias,
      extras: this.productosExtras.map(prodId => ({
        id: prodId,
        cantidad: this.extrasCantidad[prodId] || 1
      })),
      precioFinal: this.kitSeleccionado.precioBase
    };
    let precioExtras = 0;
    kitPersonalizado.extras.forEach((extra: any) => {
      const prodExtra = this.productos.find((p: any) => p.id === extra.id);
      if (prodExtra && prodExtra.precio) {
        precioExtras += prodExtra.precio * extra.cantidad;
      }
    });
    kitPersonalizado.precioFinal = kitPersonalizado.precioBase + precioExtras;
    return kitPersonalizado;
  }



  guardarKitPersonalizado(sub: boolean): void {
    this.trySuscribe();
  }


  mostrarConfirmacionPersonalizado: boolean = false;

  comprarKit(obj: any) {

    this.loading = true;
    this.purchasing = true;
    let kit = obj;

    const productosExtras = kit.extras.map((extra: { id: any; cantidad: any; }) => {
      const producto = this.productos.find(p => p.id === extra.id);
    
      return {
        id: extra.id,
        name: producto?.nombre ?? 'Producto desconocido',
        quantity: extra.cantidad
      };
    });
    

    const productosFinal = [...productosExtras];


    const id = this.IdStripe.replace(/"/g, '');

    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: id,
      esSuscripcion: false,
      activa: true,
      pagado: false,
      nombreKit: "Compra Unica / Personalizada",
      productosJson: JSON.stringify(productosFinal),
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "Compra Unica / Personalizada",
      total: kit.precio ? kit.precio : kit.precioFinal,
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: ""
    };


    this.productService.RegistrarCompraSuscripcion(suscripcion).subscribe({
      next: data => {
        console.log("Compra/suscripción registrada correctamente:", data);
      },
      error: error => {
        if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de validación' });
        }
      },
      complete: () => {
      }
    })

    this.mostrar_kit_personalizado = false;
    this.mostrarConfirmacionPersonalizado = true;





  }

  Comprando: boolean = false;
  pagarCompraUnica() {

    this.Comprando = true;
    this.authService.pay(this.kit_personalizado.precioFinal).subscribe({
      next: (response) => {
        this.Comprando = false;
      },
      error: (err) => {
        this.Comprando = false;
      }
    });

  }




  recalcularPrecioFinal(): void {
    let precioFinal = this._precio || 0;
    if (this.kit_personalizado.extras && Array.isArray(this.kit_personalizado.extras)) {
      this.kit_personalizado.extras.forEach((extra: any) => {
        const prodExtra = this.productos.find((p: any) => p.id === extra.id);
        if (prodExtra && prodExtra.precio) {
          precioFinal += prodExtra.precio * (extra.cantidad || 1);
        }
      });
    }
    this.kit_personalizado.precioFinal = precioFinal;
  }


  actualizarCantidadExtra(newValue: number, extra: any): void {
    if (newValue < 1) {
      extra.cantidad = 1;
      this.messageService.add({
        severity: 'error',
        summary: 'No se puede agregar menos de una unidad',
        detail: 'regresa a la pantalla anterior y elimina el producto'
      });
    } else {
      extra.cantidad = newValue;
    }
    this.recalcularPrecioFinal();
  }

  regresar() {
    this.mostrarModal = true;
    this.mostrarConfirmacion = false;
  }

  PersonalizarKit(): void {
    // Creamos un objeto kitPersonalizado con valores predeterminados.
    this.kit_personalizado = {
      nombre: "Kit Personalizado",
      descripcion: "Kit personalizado de acuerdo a tus necesidades",
      precioBase: 0,
      extras: [],
      precioFinal: 0
    };
    this.productosExtras = [];
    this.extrasCantidad = {};
    this.mostrar_kit_personalizado = true;
  }



}
