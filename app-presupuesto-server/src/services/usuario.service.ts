import { validarLoginDB } from '../repositories/core.usuario'

export const validaLogin = async (username: string, passwoedPlane: string) => {
    try {
        const usuarioDB = await validarLoginDB(username);
        if (!usuarioDB){
            return {existe: false, mensaje: 'Usuario no existe'}
        }

        if (passwoedPlane !== usuarioDB.password_has){
            return { existe: false, mensaje: 'Contraseña Incorrecta' }
        }

        return {
            existe: true,
            usuario: {
                usuarioDB
            }
        }
    } catch (error) {
        throw new Error('Error al validar las credenciales en la base de datos');
    }
}