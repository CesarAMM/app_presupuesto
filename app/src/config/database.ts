import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbSettings: sql.config = {
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    server: process.env.DB_SERVER as string,
    database: process.env.DB_DATABASE as string,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    }catch (error){
        console.log('Error conectado a la base de datos')
        console.log(error)
        throw error
    }
}