export interface IClasificacionGasto {
    clasificacion: string;
    valor: string;
    padre: string | null;
    estado: number;
}

export interface ITransaccion{
    transaccion?: number;
    
}