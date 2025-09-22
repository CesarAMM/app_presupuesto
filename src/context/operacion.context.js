export default class OperacionContext {
    static getOperacion(recordset) {
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
