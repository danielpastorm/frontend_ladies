import { Routes } from '@angular/router';
import { NuestrosProductosComponent } from './pages/productos/nuestros-productos/nuestros-productos.component';
import { ComprarProductosComponent } from './pages/productos/comprar-productos/comprar-productos.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { EditarproductosComponent } from './pages/productos/editarproductos/editarproductos.component';
import { DetallesproductoComponent } from './pages/detallesproducto/detallesproducto.component';
import { RegisterComponent } from './pages/register/register.component';
import { InicioComponent } from './pages/Inicio/inicio/inicio.component';
import { CrearComponent } from './pages/productos/crear/crear.component';
import { CrearkitComponent } from './pages/kits/crearkit/crearkit.component';
import { PedidosComponent } from './pages/pedidos/pedidos/pedidos.component';
import { ComprasComponent } from './pages/perfil/compras/compras.component';
import { SuscripcionComponent } from './pages/perfil/suscripcion/suscripcion.component';
import { MmComponent } from './pages/ee/mm/mm.component';
import { EditarkitsComponent } from './pages/kits/editarkits/editarkits.component';
import { MiperfilComponent } from './pages/perfil/miperfil/miperfil.component';
import { SuccessComponent } from './pages/success/success.component';
import { CancelComponent } from './pages/cancel/cancel.component';
import { ComprasAdminComponent } from './pages/compras-admin/compras-admin.component';

export const routes: Routes = [
    {
        path: '',
        component: InicioComponent,
        title: 'Ladies First'
    },

    {
        path: 'comprar-productos',
        component: ComprarProductosComponent,
        title: 'Nuestros Productos'
    },
    {
        path: 'Kits',
        component: NuestrosProductosComponent,
        title: 'Nuestros Kits'


    },
    {
        path: 'carrito',
        component: CarritoComponent,
        title: "Carrito"

    },
    {
        path: 'editarproductos',
        component: EditarproductosComponent,
        title: "Editar productos"

    },
    {
        path: 'detalleproducto',
        component: DetallesproductoComponent,
        title: "Detalle de producto"

    },
    {
        path: 'Registrarse',
        component: RegisterComponent,
        title: "Registrarse"

    },
    {
        path: 'crearProducto',
        component: CrearComponent,
        title: "Agregar Producto"

    },
    {
        path: 'crearKit',
        component: CrearkitComponent,
        title: "Agregar nuevo Kit"

    },
    {
        path: 'resumen',
        component: PedidosComponent,
        title: "Resumen de pedidos"

    },
    {
        path: 'compras',
        component: ComprasComponent,
        title: "Mis compras"

    },
    {
        path: 'suscripcion',
        component: SuscripcionComponent,
        title: "Administrar suscripciones"

    },
    {
        path: 'teamo/miamorchito',
        component: MmComponent,
        title: "Daniel y Mariss"

    },
    {
        path: 'editarKits',
        component: EditarkitsComponent,
        title: "Editar Kits"

    }
    ,
    {
        path: 'miperfil',
        component: MiperfilComponent,
        title: "Mi Perfil"

    }
    ,
    {
        path: 'success',
        component: SuccessComponent,
        title: "Gracias por tu compra!"

    }, {
        path: 'cancel',
        component: CancelComponent,
        title: "Compra cancelada"

    }, {
        path: 'GestionDePedidos',
        component: ComprasAdminComponent,
        title: "Gestion de pedidos"

    },




];
