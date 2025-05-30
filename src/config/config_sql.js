import sql from 'mssql'
import { DB_PASSWORD, DB_USER, DB_SERVER } from '../config.js'

export const getConnection = async (dbDatabase) => {
  try {
    const pool = await sql.connect({
      user: DB_USER,
      password: DB_PASSWORD,
      server: DB_SERVER,
      database: dbDatabase,
      options: { 
        encrypt: false,
        trustServerCertificate: true  
      }
    })
    return pool
  }catch (error){
    return null
  }
}
