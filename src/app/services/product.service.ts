import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from '../Data/producto.types';
import { Categorias } from '../Data/kit.types'; //aqui estaba importado Kit
import { KitDetail } from '../Data/kit.types';
import { Kit_get } from '../Data/kit.types';
import { environment } from '../../environments/environment';
import { producto } from '../pages/kits/crearkit/crearkit.component';
import { EditableRow } from 'primeng/table';
import { Kit, KitDto } from '../Data/KitsModel';
import { TreeNode } from 'primeng/api';

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



export interface DynamicSubscriptionRequest {
  CustomerId: string;
  // Monto en centavos (por ejemplo, 1500 = $15.00)
  Amount: number;
  // Opcional: si tienes un ProductId, lo envías; si no, se crea uno por defecto
  ProductId?: string;
  Name: string;
}

// La estructura de la respuesta dependerá de lo que retorne tu API.
export interface SubscriptionResponse {
  sessionId: string;
  id: string;
  customer: string;
  items: any[];
  // Puedes agregar otros campos según tu modelo de Stripe
}

export interface Usuario {
  idStripe: string;
  id: string;
  nombre: string;
}

export interface EditarMarcaCategoria {
  Id: number;
  Categoria: string;
  Marca: string;
  isCategoria: boolean;
}
export interface AgregarMarcaCategoria {
  Categoria: string;
  Marca: string;
  isCategoria: boolean;
}



@Injectable({
  providedIn: 'root'
})






export class ProductService {

  usuarios: Usuario[] = [];


  private apiUrl: string = environment.apiUrl;

  private Isprod = false;
  constructor(private http: HttpClient) { }

  getUsersList(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}CheckOut/getUsers`);
  }

  AgregarMarcaCategoria(data: any, edit: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}productos/CategoriasMarca?edit=${edit}`,
      data
    );
  }

  GetCategorias(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}productos/GetCategorias`
    );
  }

  getProductsMini(): Promise<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}productos/listar`).toPromise()
      .then(data => data || [])
      .catch(error => {
        console.error('Error al obtener productos:', error);
        return [];
      });
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}productos/listar`);
  }

  GetTree(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}productos/listar`);
  }


  getProductDetails(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}productos/Detalles/${id}`);
  }

  updateProduct(product: Producto): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}productos/EditarProducto/${product.id}`,
      product,
      { responseType: 'text' as 'json' } // Esto indica que se espera una respuesta en formato texto
    );
  }


  updateKit(product: Kit_get): Observable<string> {
    return this.http.put<string>(
      `${this.apiUrl}Kits/EditKit/${product.id}`, product);
  }



  deleteImage(id: number, image: string, p0: boolean): Observable<string> {
    // Extraer solo el nombre del archivo de la URL, en caso de que venga con ruta completa
    const imageName = image.split('/').pop() ?? "";

    // Agregar el parámetro isKit a la URL
    const url = `${this.apiUrl}Images/EliminarImagen?id=${id}&img=${encodeURIComponent(imageName)}&isKit=${p0}`;

    return this.http.post<string>(url, null, { responseType: 'text' as 'json' });
  }




  createProduct(product: Producto): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}productos/CrearProducto`,
      product,
      { responseType: 'text' as 'json' }
    );
  }



  createKit(kit: Kit): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}Kits/CrearKit`,
      kit,
      { responseType: 'text' as 'json' }
    );
  }

  getKits(): Observable<KitDetail[]> {
    return this.http.get<KitDetail[]>(`${this.apiUrl}Kits/ListarKits`);
  }

  getKitById(id: number): Observable<Kit_get[]> {
    return this.http.get<Kit_get[]>(`${this.apiUrl}Kits/ObtenerKit/${id}`);
  }




  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}CheckOut/add`, item);
  }

  RegistrarCompraSuscripcion(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}CheckOut/registrarCompraSuscripcion`, item);
  }

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}CheckOut/get/${userId}`);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}CheckOut/clear/${userId}`);
  }


  cancelarPedido(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}CheckOut/cancelarPedido/${userId}`, null);
  }



  checkout(userId: string, cartItems: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, { userId, items: cartItems });
  }

  guardarPedido(pedido: any) {
    return this.http.post(`${this.apiUrl}CheckOut/guardar`, pedido);
  }
  obtenerPedidosPorCliente(clienteId: string) {
    return this.http.get<any[]>(`${this.apiUrl}CheckOut/usuario/${clienteId}`);
  }

  obtenerClienteInfo(clienteId: string) {
    return this.http.get<any[]>(`${this.apiUrl}CheckOut/retornarPerfil/${clienteId}`);
  }

  cambiarEstadoPedido(data: any) {
    return this.http.put(`${this.apiUrl}CheckOut/cambiarEstado`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }



  obtenerTodosLosPedidos() {
    return this.http.get<any[]>(`${this.apiUrl}CheckOut/todos`);
  }


  getCategorias() {
    return this.http.get<any[]>(`${this.apiUrl}Kits/getcategorias`);
  }

  newCategoria(categoria: Categorias) {
    return this.http.post(`${this.apiUrl}Kits/agregarcategoria`, categoria);
  }

  createDynamicSubscription(request: DynamicSubscriptionRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(
      `${this.apiUrl}CheckOut/create-dynamic-subscription`, request
    );
  }


  listSubscriptions(customerId: string): Observable<any> {
    const cleanedId = customerId.replace(/"/g, '');
    return this.http.get<any>(`${this.apiUrl}CheckOut/list-subs/${cleanedId}`);
  }

  cancelSubscription(subscriptionId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}CheckOut/cancel-subscription`, { SubscriptionId: subscriptionId });
  }

  //retornar las compras del usuario

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}productos/${id}`);
  }

  crearKit(kit: any): Observable<any> {
    return this.http.post(this.apiUrl + "productos/CrearKit", kit);
  }

  getKitsNuevo(): Observable<KitDto[]> {
    return this.http.get<KitDto[]>(`${this.apiUrl + "productos/Kitsnuevo"}`);
  }


  getTreeNodes(): Observable<TreeNode[]> {
    return this.GetTree() // o getProducts()
      .pipe(
        map(products => this.buildTree(products))
      );
  }

  private buildTree(products: Product[]): TreeNode[] {
    // 1) Agrupa por categoría
    console.log()
    const byCategory = products.reduce((acc, p) => {
      const cat = p.categoria || 'Sin categoría';
      (acc[cat] ||= []).push(p);
      return acc;
    }, {} as Record<string, Product[]>);

    const tree: TreeNode[] = [];

    Object.entries(byCategory).forEach(([cat, prods], ci) => {
      // 2) Dentro de cada categoría agrupa por marca
      const byBrand = prods.reduce((acc, p) => {
        const brand = p.marca || 'Sin marca';
        (acc[brand] ||= []).push(p);
        return acc;
      }, {} as Record<string, Product[]>);

      const brandNodes: TreeNode[] = [];

      Object.entries(byBrand).forEach(([brand, items], bi) => {
        // 3) Cada producto como nodo hoja
        const productNodes = items.map((p, pi) => ({
          key: `${ci}-${bi}-${pi}`,
          label: p.nombre,
          data: p.descripcion,
          icon: 'pi pi-fw pi-file'
        } as TreeNode));

        brandNodes.push({
          key: `${ci}-${bi}`,
          label: brand,
          data: `Marca: ${brand}`,
          icon: 'pi pi-fw pi-tag',
          children: productNodes
        });
      });

      tree.push({
        key: `${ci}`,
        label: cat,
        data: `Categoría: ${cat}`,
        icon: 'pi pi-fw pi-folder',
        children: brandNodes
      });
    });

    return tree;
  }







}
