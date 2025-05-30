import { Component, numberAttribute } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

import { TableModule } from 'primeng/table';

import { DynamicSubscriptionRequest, ProductService } from '../services/product.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService, TreeNode } from 'primeng/api';
import { Kit, KitDto } from '../Data/KitsModel';
import { KitDTO } from '../pages/kits/crearkit/crearkit.component';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumber } from 'primeng/inputnumber';
import { ProgressSpinner, ProgressSpinnerModule } from 'primeng/progressspinner';
import { Carousel } from 'primeng/carousel';
import { Select } from 'primeng/select';

import { TreeSelect } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthService } from '../services/auth/auth.service';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { GalleriaModule } from 'primeng/galleria';
import { environment } from '../../environments/environment';
import { BadgeModule } from 'primeng/badge';


interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: string;
  precio: number;
  disponible: boolean;
  categoria: string | null;
  marca: string | null;
}

interface ProductosExtra {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;

}








@Component({
  selector: 'app-administrar-categoria-marca',
  imports: [TabsModule, TableModule, ButtonModule, CommonModule, Dialog, FormsModule, InputTextModule, FloatLabel,
    CardModule, ReactiveFormsModule, DropdownModule, InputNumber, ProgressSpinnerModule, Carousel, Select, TreeSelect, MultiSelectModule,
    GalleriaModule, BadgeModule
  ],
  templateUrl: './administrar-categoria-marca.component.html',
  styleUrl: './administrar-categoria-marca.component.css'
})
export class AdministrarCategoriaMarcaComponent {
  productosExtra: ProductosExtra[] = [];
  kits: KitDto[] = [];
  cargando: boolean = false;

  catalogo: { id: number; nombre: string }[] = [];
  displayModal = false;
  selectedKit!: KitDto;
  form!: FormGroup;


  productos!: any;
  responsiveOptions: any[] | undefined;


  toallas: any[] | undefined;

  selectedExtraProducts: any | undefined;
  apiUrl: string = environment.apiUrl;
  logoUrl: string = this.apiUrl + 'uploads/resources/logo.png'


  nodes!: any[];

  selectedNodes: any;

  IdStripe: string = "";
  loading: boolean = false;
  stripePromise: Promise<Stripe | null> = loadStripe('pk_live_51RRyFMACQSfwd7DO637d26RxjRuAkJT13ZJGKxVROLvmbFTP3tIUqtfBg191GBMwbnbZyVKvTp7NfLyWFoLYUPWn00gZBV7rQ2');

  obtenerUrlImagen(id: number, nombreImagen: string): string {
    return `${this.apiUrl}uploads/kit_${id}/${nombreImagen}`;
  }


  get selecciones(): FormArray {
    return this.form.get('selecciones') as FormArray;
  }



  constructor(private productService: ProductService, private messageService: MessageService, private fb: FormBuilder,
    private authService: AuthService
  ) {

  }



  ngOnInit() {


    this.productService.getKitsNuevo().subscribe((data) => {
      this.kits = data.map(kit => ({
        ...kit,
        imagenesArray: kit.imagenes
          ? kit.imagenes.split(';').map(s => s.trim())
          : []
      }));



      console.log(this.kits);
    });


    this.productService.getProducts().subscribe({
      next: data => this.productos = data.map(prod => ({
        id: prod.id,
        precio: prod.precio,
        name: prod.nombre,
        code: prod.id
      }))
    });

    this.setIdStripe();



    this.productService.GetTree().subscribe({
      next: data => {
        //this.productos = data;
        this.nodes = this.buildTree(data);


        // this.toallas = data.map(prod => ({
        //   name: prod.nombre,
        //   code: prod.id
        // }))

        console.log("tree", this.nodes);
      }
    })




    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  setIdStripe() {
    this.authService.getCustomerIdStripe(localStorage.getItem("Id") ?? '').subscribe({
      next: data => {
        const id = data.replace(/"/g, '');
        this.IdStripe = id;
      }
    })
  }


  personalizarKit: boolean = false;
  kit_personalizado: any = [];
  PersonalizarKit() {
    this.personalizarKit = true;
    // Objeto vacío que cumple con KitDto
    this.kit_personalizado = {
      id: 0,
      nombre: 'Kit Personalizado',
      descripcion: 'Kit a tu medida',
      precio: 0,
      opcionesSeleccion: [],
    };


    console.log(this.kit_personalizado);

  }
  abrirPersonalizado: boolean = false;

  personalizar() {
    console.log(this.kit_personalizado)
    this.kit_personalizado = {
      opcionesSeleccion: this.kit_personalizado.opcionesSeleccion.map((item: any) => ({
        ...item,
        cantidad: 1    // aquí la inicializas por defecto
      }))
    };
    this.abrirPersonalizado = true;

  }

  suscribirsePersonalizado() {
    this.loading = true;
    const request: DynamicSubscriptionRequest = {
      CustomerId: this.IdStripe,
      Amount: this.totalPersonal * 100,
      Name: 'Kit Personalizado'
    };
    console.log(request)


    // 1) Mapea los estáticos del kit a tu tipo ProductosExtra
    const staticExtras: ProductosExtra[] = this.kit_personalizado.opcionesSeleccion.map((pe: { productoId: number; cantidad: any; }) => {
      const prod = this.productos.find((p: { id: number; }) => p.id === pe.productoId);
      return {
        id: pe.productoId,
        nombre: prod?.name || 'Producto desconocido',
        cantidad: pe.cantidad,
        precio: prod?.precio || 0
      };
    });

    const productosOrden: ProductosExtra[] = [
      ...staticExtras
    ];
    this.registrarSubPersonalizada(productosOrden);






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











  kit_auxiliar!: KitDto;
  seleccionarKit(kit: KitDto) {
    this.displayModal = true;
    this.kit_auxiliar = kit;
    console.log(kit);
  }

  getProductData(id: number) {
    return this.productos.find((p: { id: number; }) => p.id === id);
  }

  // En administrar-categoria-marca.component.ts
  /** Devuelve array de nombres de archivo, o ['placeholder.jpg'] si no hay ninguno */
  getProductImages(id: number): string[] {
    const prod = this.productos.find((p: { id: number; }) => p.id === id);
    if (!prod?.imagenes) {
      return ['placeholder.jpg'];
    }
    return prod.imagenes
      .split(';')            // separa por punto y coma
      .map((x: string) => x.trim())    // quita espacios
      .filter((x: any) => !!x);     // elimina strings vacíos
  }

  /** Devuelve la primera imagen o placeholder */
  getPrimaryImage(id: number): string {
    return this.getProductImages(id)[0] || 'placeholder.jpg';
  }




  //tree nodes
  private buildTree(products: Product[]): TreeNode[] {
    // 0) Filtramos para quedarnos solo con los que tienen categoría y marca definidas
    const validProducts = products.filter(p =>
      p.categoria?.trim() && p.marca?.trim()
    );

    // 1) Agrupa por categoría (ya todos tienen categoría)
    const byCategory = validProducts.reduce((acc, p) => {
      const cat = p.categoria!;
      (acc[cat] ||= []).push(p);
      return acc;
    }, {} as Record<string, Product[]>);

    const tree: TreeNode[] = [];

    Object.entries(byCategory).forEach(([cat, prods], ci) => {
      // 2) Dentro de cada categoría agrupa por marca (todos tienen marca)
      const byBrand = prods.reduce((acc, p) => {
        const brand = p.marca!;
        (acc[brand] ||= []).push(p);
        return acc;
      }, {} as Record<string, Product[]>);

      const brandNodes: TreeNode[] = [];

      Object.entries(byBrand).forEach(([brand, items], bi) => {
        // 3) Cada producto como nodo hoja
        const productNodes: TreeNode[] = items.map((p, pi) => ({
          id: p.id,
          key: `${ci}-${bi}-${pi}`,
          label: p.nombre,
          data: p.descripcion,
          icon: 'pi pi-fw pi-circle',
        }));

        brandNodes.push({
          key: `${ci}-${bi}`,
          label: brand,
          data: `Marca: ${brand}`,
          icon: 'pi pi-fw pi-circle-fill',
          children: productNodes,
          selectable: false,

        });
      });

      tree.push({
        key: `${ci}`,
        label: cat,
        data: `Categoría: ${cat}`,
        icon: 'pi pi-heart',
        children: brandNodes,
        selectable: false,

      });
    });

    return tree;
  }


  modalExtras: boolean = false;
  //solo si selecciono algo en toallas o tampones
  Suscribirse() {
    this.loading = true;

    if (this.selectedNodes === undefined) {
      this.mostrarModal('info', 'Selecciona una opción de proteccion',);
      this.loading = false;
      return;
    }

    //selected nodes es para el producto seleccionado de toallas o tampones
    if (Array.isArray(this.selectedExtraProducts) && this.selectedExtraProducts.length > 0) {
      this.displayModal = false;
      this.modalExtras = true;
      // Mapeo a ProductosExtra, arrancando cantidad en 1
      const extras: ProductosExtra[] = this.selectedExtraProducts.map((item: { code: any; name: string; }) => {
        // Busca en tu catálogo el producto cuyo id coincida con el code
        const prod = this.productos.find((p: { id: any; }) => p.id === item.code);

        console.log("precio roducto", this.productos)

        return {
          id: item.code,
          nombre: item.name.trim(),
          cantidad: 1,                    // valor inicial que luego podrás modificar
          precio: prod ? prod.precio : 0
        };
      });

      // Ahora puedes guardar `extras` en tu componente y pasarlo al modal:
      this.productosExtra = extras;

      this.confirmarExtras();
      this.loading = false;
      return;


    }


    const request: DynamicSubscriptionRequest = {
      CustomerId: this.IdStripe,
      Amount: this.precioExtras ? this.precioExtras * 100 : this.kit_auxiliar.precio,
      Name: this.kit_auxiliar.nombre
    };


    // 1) Mapea los estáticos del kit a tu tipo ProductosExtra
    const staticExtras: ProductosExtra[] = this.kit_auxiliar.productosEstaticos.map(pe => {
      const prod = this.productos.find((p: { id: number; }) => p.id === pe.productoId);
      return {
        id: pe.productoId,
        nombre: prod?.name || 'Producto desconocido',
        cantidad: pe.cantidad,
        precio: prod?.precio || 0
      };
    });

    const productosOrden: ProductosExtra[] = [
      ...staticExtras,
    ];
    this.registrarSub(productosOrden);






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

  get totalExtras(): number {
    return this.productosExtra
      .reduce((sum, ex) => sum + ex.precio * ex.cantidad, 0);
  }

  precioExtras: number = 0;
  confirmarExtras() {
    const total = this.totalExtras;
    const precioBase = this.kit_auxiliar.descuento == 0 ? this.kit_auxiliar.precio : this.kit_auxiliar.precioConDescuento;

    this.precioExtras = precioBase + total;

    console.log('Total de extras:', total);
    // aquí guardas `total` junto con los detalles, p.e.:
    const payload = {
      extras: this.productosExtra,
      totalExtras: total
    };
  }


  totalPersonal: number = 0;
  calcularPersonal() {
    this.totalPersonal = this.kit_personalizado.opcionesSeleccion
      // reduce acumula la suma de (precio * cantidad)
      .reduce((acum: number, op: any) => acum + (op.precio * (op.cantidad || 0)), 0);

    console.log('Total personalizado:', this.totalPersonal);
  }


  trysuscribe() {
    this.loading = true;
    const request: DynamicSubscriptionRequest = {
      CustomerId: this.IdStripe,
      Amount: this.precioExtras ? this.precioExtras * 100 : this.kit_auxiliar.precio,
      Name: this.kit_auxiliar.nombre
    };


    // 1) Mapea los estáticos del kit a tu tipo ProductosExtra
    const staticExtras: ProductosExtra[] = this.kit_auxiliar.productosEstaticos.map(pe => {
      const prod = this.productos.find((p: { id: number; }) => p.id === pe.productoId);
      return {
        id: pe.productoId,
        nombre: prod?.name || 'Producto desconocido',
        cantidad: pe.cantidad,
        precio: prod?.precio || 0
      };
    });

    const productosOrden: ProductosExtra[] = [
      ...staticExtras,
      ...this.productosExtra
    ];
    this.registrarSub(productosOrden);






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


  registrarSub(productosOrden: ProductosExtra[]) {

    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: this.IdStripe,
      esSuscripcion: true,
      activa: true,
      pagado: false,
      nombreKit: this.kit_auxiliar.nombre,
      productosJson: JSON.stringify(productosOrden),
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "mensual",
      total: this.precioExtras,
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: "",
      estatus: 'Pendiente',
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
  }



  registrarSubPersonalizada(productosOrden: ProductosExtra[]) {

    const suscripcion = {
      idUsuario: localStorage.getItem("Id"),
      idUsuarioStripe: this.IdStripe,
      esSuscripcion: true,
      activa: true,
      pagado: false,
      nombreKit: 'Personalizado',
      productosJson: JSON.stringify(productosOrden),
      enviada: false,
      fechaEnvio: null,
      frecuenciaEnvio: "mensual",
      total: this.precioExtras,
      fechaCreacion: new Date().toISOString(),
      cancelada: false,
      motivoCancelacion: null,
      notasAdmin: "",
      estatus: 'Pendiente',
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
  }


  mostrarModal(severity: string, summary: string, detail: string = "") {
    if (detail != "") {
      this.messageService.add({ severity: severity, summary: summary, detail: detail });

    } else {
      this.messageService.add({ severity: severity, summary: summary, });

    }
  }



}
