import {insert_operacion} from '../repositories/operaciones.repository'
import { IResponseServicio } from '../interfaces/IRespuestaService';

export const post_insert_operacion = async (datos: any): Promise<IResponseServicio> => {
    try {
        const resInsertarOperacion = await insert_operacion();

        if (!resInsertarOperacion.ok){
            return resInsertarOperacion
        }
        
        return {
            ok: true,
            mensaje: 'OPERACION EXITOSA',
            data: {
                operacion: resInsertarOperacion.data
            }
        }

    } catch (error) {
        return {
            ok: false,
            mensaje: 'Error en el operaciones.servicio'
        }
    }
}