import sql from 'mssql';
import { getConnection } from '../config/config_sql.js';
export default class ReporteRepository {
    static async data_operacion() {
        try {
            const pool = await getConnection("cam_presupuesto");
            const result = await pool.request()
                .input('i_operacion', sql.Char, 'Q')
                .execute('sp_operacion');
            pool.close();
            return { "estatus": true, "data": result };
        }
        catch (error) {
            return { "estatus": false, "mensaje": "Error en la base de datos" };
        }
    }
}
