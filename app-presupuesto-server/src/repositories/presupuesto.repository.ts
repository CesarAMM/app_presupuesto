import sql from 'mssql'
import { getConnection } from '../config/database'
import { IPresupuestoDetalle, IPresupuestoEncabezado } from '../interfaces/Presupuesto'

export const insert_presupuesto = async(datos: IPresupuestoEncabezado) =>{
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('i_fecha_ini', sql.DateTime, datos.fechaInicio)
            .input('i_fecha_fin', sql.DateTime, datos.fechaFin)
            .input('i_egreso', sql.Money, datos.totalEgreso)
            .input('i_ingreso', sql.Money, datos.totalEgreso)
            .input('i_usuario', sql.VarChar, 'cmazariegos')
            .query(`
                declare @w_presupuesto	int,
                        @w_fecha		datetime

                select @w_presupuesto = isnull(max(presupuesto), 0)
                from core.presupuesto 

                set @w_presupuesto = @w_presupuesto +1
                set @w_fecha = getdate()

                insert into core.presupuesto (presupuesto, fecha_ing, fecha_ini, fecha_fin, total_egreso, total_ingreso, usuario)
                values (@w_presupuesto, @w_fecha, @i_fecha_ini, @i_fecha_fin, @i_egreso, @i_ingreso, @i_usuario)

                select @w_presupuesto 'id'`)
        pool.close();
        return result.recordset[0] || null;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const insert_presupuesto_detalle = async(idPresupuesto: number, datos: IPresupuestoDetalle) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('i_presupuesto', sql.Int, idPresupuesto)
            .input('i_operacion', sql.VarChar, datos.tipoOperacion.id)
            .input('i_frecuencia', sql.VarChar, datos.frecuencia.id)
            .input('i_categoria', sql.VarChar, datos.categoria.id)
            .input('i_subcategoria', sql.VarChar, datos.subCategoria.id)
            .input('i_monto', sql.Money, datos.monto)
            .query(`
                declare @w_indice	int,
                        @w_fecha	datetime

                select @w_indice = isnull(max(indice), 0)
                from core.matriz_presupuesto
                where presupuesto = @i_presupuesto

                set @w_indice = @w_indice  + 1
                set @w_fecha = getdate()

                insert into core.matriz_presupuesto (presupuesto, indice, operacion, frecuencia, categoria, subcategoria, monto)
                values (@i_presupuesto, @w_indice, @i_operacion, @i_frecuencia, @i_categoria, @i_subcategoria, @i_monto)
                select @w_indice 'indice'`)

        pool.close();
        return result.recordset[0] || null
    } catch (error) {
        console.log(error)
        return null;
    }
}