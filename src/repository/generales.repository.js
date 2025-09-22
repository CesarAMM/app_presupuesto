import sql from 'mssql';
import { getConnection } from '../config/config_sql.js';
export default class GeneralesRepository {
    static async data_catalogo(req) {
        const { tabla } = req.body;
        try {
            const pool = await getConnection("db_presupuesto");
            const result = await pool.request()
                .input('i_operacion', sql.VarChar, 'Q')
                .input('i_modo', sql.Int, 1)
                .input('i_tabla', sql.VarChar, tabla)
                .execute('sp_catalogo');
            pool.close();
            return { status: true, data: result };
        }
        catch (error) {
            console.log(error);
            return { status: false, data: null };
        }
    }
}
