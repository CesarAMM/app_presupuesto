import {Request, Response} from 'express'
import { post_insert_operacion, get_sel_metada_operaciones } from '../services/operaciones.service'

export const postOperacion = async (req: Request, res: Response) =>{
    try {
        const data = req.body;
        const respuesta = await post_insert_operacion(data);
        res.status(200).json(respuesta)        
    } catch (error) {
        res.status(500).json({
            ok: false, mensaje: 'Error en transaccion'
        })   
    }
}

export const getSelMetadaOperaciones = async (req: Request, res: Response) => {
    try {
        const respuesta = await get_sel_metada_operaciones();
        res.status(200).json(respuesta)
    } catch (error) {
        res.status(500).json({
            ok: false, mensaje: 'Error en operaciones.controller.postSelMetadaOperaciones'
        })
    }
}