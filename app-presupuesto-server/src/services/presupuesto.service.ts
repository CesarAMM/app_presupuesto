import { IPresupuesto } from '../interfaces/Presupuesto'
import { insert_presupuesto, insert_presupuesto_detalle } from '../repositories/presupuesto.repository'

export const post_presupuesto = async (datos: IPresupuesto) =>{
    console.log(datos.detalle[0].categoria)
    console.log(datos.detalle[0].tipoOeracion)
    console.log(datos.detalle[0].frecuencia)
    console.log(datos.detalle[0].subCategoria)


    try {
        const respuestaEncabezado = await insert_presupuesto(datos.presupuesto);
        if(!respuestaEncabezado){
            return { ok: false, mensaje: 'Error en crear el encabezado.'}
        }
        
        datos.detalle.forEach( async dato =>{
            const respuestaDetalle = await insert_presupuesto_detalle(respuestaEncabezado.id, dato);
        })

    } catch (error) {
        console.log(error)
        throw new Error('ERROR EN INSERAR INFORMACION DE PRESUPUESTO');
    }
}