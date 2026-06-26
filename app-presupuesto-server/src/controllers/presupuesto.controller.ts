import {Request, Response} from 'express'
import { post_presupuesto } from '../services/presupuesto.service'

export const postPresupuesto = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const respuesta = await post_presupuesto(data);
        res.status(200).json({
            ok: respuesta?.ok,
            mensaje: respuesta?.mensaje
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error Interno del servidor'
        })
    }
}