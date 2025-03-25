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
  