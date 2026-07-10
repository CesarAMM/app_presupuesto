import {insert_operacion} from '../repositories/operaciones.repository'
import { IResponseServicio } from '../interfaces/IRespuestaService';
import { sel_metadata_operaciones } from '../repositories/metadata.repository';

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

export const get_sel_metada_operaciones = async (): Promise<IResponseServicio> => {
    try {
        const respuesta = await sel_metadata_operaciones();
        return respuesta;
    } catch (error) {
        return {
            ok: false,
            mensaje: 'ERROR EN operacion.servicio.post_sel_metada_operaciones'
        }
    }
}