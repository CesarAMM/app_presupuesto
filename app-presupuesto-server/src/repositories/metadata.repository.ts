import { getConnection } from '../config/database';
import { IClasificacionGasto } from '../interfaces/ClasificacionGasto'
import { IResponseServicio } from '../interfaces/IRespuestaService'
import sql from 'mssql'

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
            .input('i_operacion', sql.Char, 'Q')
            .execute('sp_metadata_operaciones');
        pool.close();
        return {
            ok: true,
            mensaje: 'OPERACION EXITOSA',
            data: result.recordsets
        };
    } catch (e) {
        const ErrorDB = e as Error;
        
        return {
            ok: false,
            mensaje: ErrorDB.message ||'ERROR INTERNO EN LA BASE DE DATOS'            
        }
    }
}