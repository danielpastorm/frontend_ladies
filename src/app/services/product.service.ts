import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../Data/producto.types';
import { Categorias, Kit } from '../Data/kit.types';
import { KitDetail } from '../Data/kit.types';
import { Kit_get } from '../Data/kit.types';

@Injectable({
  providedIn: 'root'
})



export class ProductService {

  
  
  private Isprod = false;
  
  private url_kits = this.Isprod ? '/Kits' : 'https://localhost:7027/Kits';
  private apiUrl = this.Isprod? '/CheckOut' : 'https://localhost:7027/CheckOut';
  private home = this.Isprod ? '/' : 'https://localhost:7027/';

  constructor(private http: HttpClient) {}

  getProductsMini(): Promise<Producto[]> {
    return this.http.get<Producto[]>(`${this.home}productos/listar`).toPromise()
      .then(data => data || [])
      .catch(error => {
        console.error('Error al obtener productos:', error);
        return [];
      });
  }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.home}productos/listar`);   
  }
  

  getProductDetails(id: number): Observable<Producto> {
    // Supongamos que tu endpoint está definido como: GET /Productos/Detalles?id=5
    return this.http.get<Producto>(`${this.home}productos/Detalles/${id}`);
  } 

  updateProduct(product: Producto): Observable<string> {
    return this.http.post<string>(
      `${this.home}productos/EditarProducto/${product.id}`,
      product,
      { responseType: 'text' as 'json' } // Esto indica que se espera una respuesta en formato texto
    );
  }

  
  updateKit(product: Kit_get): Observable<string> {
    return this.http.put<string>(
      `${this.url_kits}/EditKit/${product.id}`, product);
  } 
  
  
  
  deleteImage(id: number, image: string, p0: boolean): Observable<string> {
    // Extraer solo el nombre del archivo de la URL, en caso de que venga con ruta completa
    const imageName = image.split('/').pop() ?? "";
    
    // Agregar el parámetro isKit a la URL
    const url = `${this.home}Images/EliminarImagen?id=${id}&img=${encodeURIComponent(imageName)}&isKit=${p0}`;
    
    return this.http.post<string>(url, null, { responseType: 'text' as 'json' });
  }
  
  
  

  createProduct(product: Producto): Observable<string> {
    return this.http.post<string>(
      `${this.home}productos/CrearProducto`,
      product,
      { responseType: 'text' as 'json' }
    );
  }

  

  createKit(kit: Kit): Observable<string> {
    return this.http.post<string>(
      `${this.home}Kits/CrearKit`,
      kit,
      { responseType: 'text' as 'json' }
    );
  }

  getKits(): Observable<KitDetail[]> {
    return this.http.get<KitDetail[]>(`${this.home}Kits/ListarKits`);
  }

  getKitById(id: number): Observable<Kit_get[]>{
    return this.http.get<Kit_get[]>(`${this.home}Kits/ObtenerKit/${id}`);
  }




  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, item);
  }

  getCart(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${userId}`);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }


  checkout(userId: string, cartItems: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, { userId, items: cartItems });
  }

  guardarPedido(pedido: any) {
    return this.http.post(`${this.apiUrl}/guardar`, pedido);
  }

  obtenerPedidosPorCliente(clienteId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${clienteId}`);
  }

  cambiarEstadoPedido(id: string, data: { NuevoEstado: string; Guia: string }) {
    return this.http.put(`${this.apiUrl}/${id}/estado`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  

  obtenerTodosLosPedidos() {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }


  getCategorias(){
    return this.http.get<any[]>(`${this.url_kits}/getcategorias`);
  }

  newCategoria(categoria: Categorias) {
    return this.http.post(`${this.url_kits}/agregarcategoria`, categoria);
  }

  
  
  
  


  
}
