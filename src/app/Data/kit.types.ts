export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    imagenes?: string;
    precio: number;
    disponible: boolean;
  }
  
  export interface ProductoEnKit {
    // Solo enviamos el id del producto y la cantidad; 
    // el backend se encargará de buscar la entidad Producto y asignar las relaciones
    productoId: number;
    cantidad: number;
  }
  
  export interface Kit {
    id?: number;  // Opcional, ya que lo asigna el backend
    nombre: string;
    descripcion: string;
    // Usamos 'disponible' en el JSON, que en el backend se mapea a 'Visible'
    disponible: boolean;
    // Las imágenes se pueden enviar opcionalmente o gestionarlas aparte
    imagenes?: string;
    productosEnKit: ProductoEnKit[];
  }


  // Define una interfaz para el resultado plano del SP o endpoint
  export interface KitDetail {
    kitId: number;
    kitNombre: string;
    kitDescripcion: string;
    imagenes: string;       // Campo que contiene la(s) imagen(es) del kit
    kitPrecio: number;
    disponible: boolean;
    productoId: number;
    nombreProducto: string;
    cantidad: number;
    precioUnitario: number;
  }
  
  