interface Operacion {
    toperacion: string,
    categoria: string,
    tcategoria: string,
    subcategoria: string,
    cuenta: string,
    matriz: string
}


export default class OperacionContext{
    static getOperacion(recordset: any[]): Operacion[] {
        return recordset.map(row => ({
            toperacion: row.TOPERACION,
            categoria: row.CATEGORIA,
            tcategoria: row.TCATEGORIA,
            subcategoria: row.SUBCATEGORIA,
            cuenta: row.CUENTA,
            matriz: row.MATRIZ
        }));
    }
}