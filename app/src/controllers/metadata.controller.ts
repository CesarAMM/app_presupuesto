import { Request, Response } from 'express'
import { listClasificacionesGasto, setClasificacionGasto } from '../services/metadata.service'

export const getClasificacionesGasto = async(req: Request, res: Response) => {
    try {
        const data = await listClasificacionesGasto();
        res.status(200).json({ ok: true, data });
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error Interno del servidor al obtener la metadata'
        })
    }
}

export const postClasificacionGasto = async(req: Request, res: Response) => {
    try{
        const data = await setClasificacionGasto();
        res.status(200).json({ ok: true, data })
    }catch (error) {
        res.status(500).json({
            ok:false,
            mensaje: 'Error interno del servidor para almacenar datos'
        })
    }
} 