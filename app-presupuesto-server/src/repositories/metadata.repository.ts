import { getConnection } from '../config/database';
import { IClasificacionGasto } from '../interfaces/ClasificacionGasto'
import { IResponseServicio } from '../interfaces/IRespuestaService'

/* OPTENER ARBOL DE CLASIFICACION DE GASTOS */
export const listClasificacionGastoDB = async (): Promise<IClasificacionGasto[]> => {
    const pool = await getConnection();
    const result = await pool.request().query(`
        select * from metadata.clasificacion_gasto
        where estado = 1
        order by clasificacion asc
    `)
    pool.close();
    return result.recordset;
}

export const setClasificacionGastoDB = async () =>{
    
}
export const sel_metadata_operaciones = async (): Promise<IResponseServicio> => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query(`
                select  * 
                from    metadata.clasificacion_gasto
                where   estado = 1
                order   by clasificacion asc

                select	codigo, 
                        cuenta + ' - ' + tipo "dedscripcion" 
                from	core.cuenta
                where	estado = 1

                select	c.codigo, c.valor
                from	metadata.tabla t
                inner join metadata.catalogo c on t.codigo = c.tabla
                where t.tabla = 'tbl_tipo_transaccion'

                select 	*
		        from metadata.producto
                where estado = 1

                select 	*
		        from metadata.dimension
                where estado = 1

                select 	*
		        from metadata.detalle_gasto
                where estado = 1
            `);
        pool.close();
        return {
            ok: true,
            mensaje: 'OPERACION EXITOSA',
            data: result.recordsets
        };
    } catch (e) {
        console.log(e)
        return {
            ok: false,
            mensaje: 'ERROR EN CONSULTA DB'
        }
    }
}