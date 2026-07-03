import type { Item } from './presupuesto'

export interface DetalleCompra {
    idLocal: number;
    detalle: string;
    costoUnitario: number;
    unidad: string;
    cantidad: number;
    totalRow: number; 
}

export interface Operacion {
    fechaOperacion: string;
    tipoOperacion: Item | null;
    frecuencia: Item | null;
    categoria: Item | null;
    subCategoria: Item | null;
    cuenta: Item | null;
    monto: string;
    descripcion: string | null;
}