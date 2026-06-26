import { IPresupuesto } from '../interfaces/Presupuesto'
import { insert_presupuesto, insert_presupuesto_detalle } from '../repositories/presupuesto.repository'

export const post_presupuesto = async (datos: IPresupuesto) =>{
    try {
        const respuestaEncabezado = await insert_presupuesto(datos.presupuesto);
        if(!respuestaEncabezado){
            return { ok: false, mensaje: 'Error en crear el encabezado.'}
        }
        
        datos.detalle.forEach( async dato =>{
            const respuestaDetalle = await insert_presupuesto_detalle(respuestaEncabezado.id, dato);
        })

    } catch (error) {
        return {ok: false, mensaje: 'ERROR EN INSERAR INFORMACION DE PRESUPUESTO'}
    }
}