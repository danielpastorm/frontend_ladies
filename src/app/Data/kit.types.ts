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
    nombre: string,
    descripcion: string,
    disponible: boolean,
    precio:number,
    categoriasJson: string
  }

  export interface Kit_get {
    id: number;
    nombre: string;
    descripcion: string;
    imagenes: string;
    precio: number;
    disponible: boolean;
    categoriasJson: string; // contiene el JSON serializado
  }

  // Define una interfaz para el resultado plano del SP o endpoint
  export interface KitDetail {
    categoriasJson: string;
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


  export interface Categorias {
    Id: number,
    categoria: string;
  }
  
  