export interface Producto {
  forEach(arg0: (selectedProduct: { imagenesArray: any; imagenes: string; }) => void): unknown;
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: string;
  precio: number;
  disponible: boolean;
  imagenesArray?: string[];
  cantidad: number
}



export interface ArticulosEnCompra {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface CompraUnica {
  articulos: ArticulosEnCompra[];
}