import sql from 'mssql'
import { getConnection } from '../config/database'
import { IUsusario } from '../interfaces/Usuario'

/* OPERACIONES DE COSULTAS PARA VALIDACIONES DE USUARIO */
export const validarLoginDB = async (username: string): Promise<IUsusario | null> => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`
                select	u.usuario, u.user_login, u.password_has, tabla.codigo, tabla.valor
                from	core.usuario u
                inner join (	select c.codigo, c.valor from metadata.tabla t
                                inner join metadata.catalogo c on t.codigo = c.tabla
                                where t.tabla = 'tbl_rol' ) tabla on tabla.codigo = u.rol
                where u.user_login = @username
                and u.estado = 1 `);
        pool.close();
        return result.recordset[0] || null;
    } catch (error) {
        return null;
    }
}