import sql from 'mssql';
import dotenv from 'dotenv';
dotenv.config();
export const getConnection = async (dbDatabase) => {
    const config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER || 'localhost',
        database: dbDatabase,
        options: { encrypt: false, trustServerCertificate: true }
    };
    return await sql.connect(config);
};
