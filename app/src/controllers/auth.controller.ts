import { Request, Response} from 'express'
import { validaLogin } from '../services/usuario.service'

export const authUser = async (req: Request, res: Response) =>{
    try {
        const {username, password} = req.body

        if (!username || !password){
            res.status(400).json({ ok: false, mensaje: "El usuario y la contraseña son obligatorios" })
            return;
        }
        const data = await validaLogin(username, password)
        
        if(!data.existe){
            res.status(401).json({ok: false, mensaje: data.mensaje})
            return;
        }

        res.status(200).json({
            ok:true,
            mensaje: 'Inicio de sesion Exitoso',
            usuario: data.usuario
        })
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' });
    }
} 