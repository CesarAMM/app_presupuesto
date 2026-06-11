import { listClasificacionGastoDB, 
    setClasificacionGastoDB 
} from '../repositories/metadata.repository'

export const listClasificacionesGasto = async () => {
    try {
        const clasificacion = await listClasificacionGastoDB();
        return clasificacion;
    } catch (error) {
        throw new Error('Error en el servicio al obtener las clasificaciones')
    }
}

export const setClasificacionGasto = async () => {
    try {
        const respuesta = await setClasificacionGastoDB();
        return respuesta;
    } catch (error) {
        throw new Error('Error en almacenar nueva clasificacion Gasto')
    }
} 