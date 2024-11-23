const mssql = require('mssql')
const config = require('../config.json')
const config_db = config.mssql_credenciales

const dbSetting = {
  user: config_db.DB_USER,
  password: config_db.DB_PASSWORD,
  server: config_db.DB_SERVER,
  database: config_db.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: false
  }
}

module.exports =  dbSetting