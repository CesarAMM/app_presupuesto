import { Request, Response, NextFunction } from 'express';

export const basicAuth = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Obtenemos el header de autorización
    const authHeader = req.headers.authorization;

    // 2. Verificamos que exista y que sea de tipo 'Basic'
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).json({ 
            ok: false, 
            mensaje: 'Acceso denegado. Se requiere autenticación.' 
        });
        return; // Detenemos la ejecución
    }

    try {
        // 3. Extraemos el token (quitamos la palabra "Basic ")
        const token = authHeader.split(' ')[1];

        // 4. Decodificamos el token de Base64 a texto plano (queda como "usuario:contraseña")
        const credencialesDecodificadas = Buffer.from(token, 'base64').toString('utf-8');
        
        // 5. Separamos el usuario de la contraseña
        const [usuario, password] = credencialesDecodificadas.split(':');

        // 6. Obtenemos las credenciales válidas de nuestras variables de entorno
        const userValido = process.env.API_USER;
        const passValida = process.env.API_PASSWORD;

        // 7. Comparamos
        if (usuario === userValido && password === passValida) {
            next(); // Las credenciales son correctas, dejamos que la petición continúe
        } else {
            res.status(401).json({ 
                ok: false, 
                mensaje: 'Credenciales inválidas. Usuario o contraseña incorrectos.' 
            });
        }
    } catch (error) {
        res.status(400).json({ 
            ok: false, 
            mensaje: 'Error al procesar el header de autenticación.' 
        });
    }
};