import { getConnection } from '../config/database';
import { IClasificacionGasto } from '../interfaces/ClasificacionGasto'

export const getClasificacionGasto = async (): Promise<IClasificacionGasto[]> => {
    const pool = await getConnection();
    const result = await pool.request().query(`
        select * from metadata.clasificacion_gasto
        where estado = 1
        order by clasificacion asc
    `)
    pool.close();
    return result.recordset;
}