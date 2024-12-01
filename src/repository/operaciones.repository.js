import sql from 'mssql'
import {getConnection} from '../config/config_sql.js'

export default class OperacionRepository {
  static async data_operacion (){
    const pool = await getConnection("cam_presupuesto")
    const result = await pool.request()
      .input('i_operacion', sql.Char, 'Q')
      .execute('sp_operacion')
    pool.close()
    return result
  }

  static async insert_operacion ({ toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle }) {
    console.log({ toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle })
  }

  static select_operacion () {

  }
}
