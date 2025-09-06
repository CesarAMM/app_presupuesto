import sql from 'mssql'
import { getConnection } from '../config/config_sql.js'

export default class PresupuestoRepository {
    
    static async data_presupuesto (){
        try{
            const pool = await getConnection('presupuesto')
            const result = await pool.request()
                .input('i_operacion', sql.Char, 'I')
                .input('i_modo', sql.Int, 0)
                .execute('sp_presupuesto')
            pool.close()
            return { status: true, data: result }
        }catch(error){
            return { status: false, msj: "Error en la base de datos."}
        }
    }
}
