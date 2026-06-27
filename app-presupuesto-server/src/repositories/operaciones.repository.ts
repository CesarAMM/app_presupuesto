import sql from 'mssql'
import {getConnection} from '../config/database'
import { IResponseServicio } from '../interfaces/IRespuestaService';

export const insert_operacion = async (): Promise<IResponseServicio> => {
    try {
        const pool = await getConnection();
        const response = await pool.request()
            .query(`
                select 1
                `)
        pool.close();
        return {
            ok: true, 
            mensaje: 'consulta exitosa', 
            data: response.recordset[0]
        }
    } catch (error) {
        return {
            ok: false, 
            mensaje: 'Error en Insertar datos.'
        }
    }
}