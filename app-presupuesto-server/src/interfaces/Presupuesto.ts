export interface IItem{
    id: string;
    descripcion: string;
}

export interface IPresupuestoDetalle {
    idLocal: number;
    tipoOperacion: IItem;
    frecuencia: IItem;
    categoria: IItem;
    subCategoria: IItem;
    monto: number;
}

export interface IPresupuestoEncabezado {
    fechaInicio: string;
    fechaFin: string;
    totalIngreso: number;
    totalEgreso: number;
    total: number;
}

export interface IPresupuesto{
    presupuesto: IPresupuestoEncabezado;
    detalle: IPresupuestoDetalle[];
}