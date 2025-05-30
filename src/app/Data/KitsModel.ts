export interface ProductoEstatico {
  IdProducto: number;
  Cantidad: number;
}

export interface OpcionSeleccionProducto {
  ProductoId: number; 
  Cantidad: number;
}



export interface OpcionSeleccion {
  titulo: string;
  orden: number;
  productos: OpcionSeleccionProducto[];
}

export interface Kit {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number;
  imagenes: string; // separadas por comas
  productosEstaticos: ProductoEstatico[];
  OpcionesSeleccion: OpcionSeleccion[];
}


/////
export interface KitDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  descuento: number;
  imagenes: string; // ya parseamos en DTO a string[]
  precioConDescuento: number;
  Disponible: boolean;
  productosEstaticos: ProductoEstaticoDto[];
  opcionesSeleccion: OpcionSeleccionDto[];
  imagenesArray: any[];
}

export interface ProductoEstaticoDto {
  id: number;
  productoId: number;
  cantidad: number;
}

export interface OpcionSeleccionDto {
  id: number;
  titulo: string;
  orden: number;
  productos: OpcionSeleccionProductoDto[];
}

export interface OpcionSeleccionProductoDto {
  id: number;
  productoId: number;
  cantidad: number;
}
