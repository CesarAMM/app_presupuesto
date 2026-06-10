import { getClasificacionGasto } from '../repositories/metadata.repository'

export const listClasificacionesGasto = async () => {
    try {
        const clasificacion = await getClasificacionGasto();
        return clasificacion;
    } catch (error) {
        throw new Error('Error en el servicio al obtener las clasificaciones')
    }
}