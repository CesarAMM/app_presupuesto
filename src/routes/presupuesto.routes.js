const express = require('express');
const router = express.Router()
const mssql = require('mssql')
const dbSetting = require('../config/connection');

router.get('/presupuesto', async (req, res) => {
  const pool = await new mssql.ConnectionPool(dbSetting);
  const connection = await pool.connect();
  connection.close();
  res.json({coneccion: "asy"})
})

router.post('/presupuesto', async (req, res) => {
  const {
    

  } = req.body
  const pool = await new mssql.ConnectionPool(dbSetting);
  const connection = await pool.connect();
  connection.close();
  res.json({coneccion: "asy"})
})

module.exports = router
