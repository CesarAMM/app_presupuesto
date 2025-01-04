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

  static async insert_operacion ( VLTOperacion, VLCategoria, VLSubcategoria, VLCuenta, VLMonto, VLFecha) {
    let VLCodigo = null, VLReturn = null
    //! Enviar encabezado
    try {
      const pool = await getConnection("cam_presupuesto");
      const result = await pool.request()
        .input('i_operacion', sql.Char, 'I')
        .input('i_modo', sql.Int, 1)
        .input('i_toperacion', sql.Int, VLTOperacion)
        .input('i_categoria', sql.Int, VLCategoria)
        .input('i_subcategoria', sql.Int, VLSubcategoria)
        .input('i_cuenta', sql.Int, VLCuenta)
        .input('i_monto', sql.Money, VLMonto)
        .input('i_fecha', sql.VarChar, VLFecha)
        .execute('sp_operacion')
      pool.close()
      VLCodigo = parseInt(result.recordset[0].Codigo);
      VLReturn = parseInt(result.returnValue)
      if (VLReturn != 0){ return {"estatus": false, "mensaje": "Error - insertar operacion" }}
      return {"estatus": true, "codigo": VLCodigo, "mensaje": `Se a registrado la operacion #${VLCodigo}`}
    } catch (error) { 
      return { "estatus": false, "mensaje": "Error en la base de datos"} 
    }
    
  }

  static async insert_det_operacion(VTOperacion, VTCodigo, VTDescripcion, VTMedida, VTCantidad, VTMonto){
    try{
      const pool = await getConnection("cam_presupuesto");
      const result = await pool.request()
        .input("i_operacion", sql.Char, "I")
        .input("i_modo", sql.Int, 2)
        .input("i_num_operacion", sql.Int, VTOperacion)
        .input("i_det_operacion", sql.Int, VTCodigo)
        .input("i_descripcion", sql.VarChar, VTDescripcion)
        .input("i_medida", sql.VarChar, VTMedida)
        .input("i_cantidad", sql.Int, VTCantidad)
        .input("i_det_monto", sql.Money, VTMonto)
        .execute("sp_operacion");
      pool.close();
      const VLReturn = result.returnValue

      if(VLReturn != 0){return {"estatus": false, "mensaje": "Error - insertar detalle de la operacion" }}
      return {"estatus": true}
    }catch(err){
      return { "estatus": false, "mensaje": "Error en la base de datos"}
    }
  }

  static select_operacion () {

  }
}
