import OperacionRepository from '../repository/operaciones.repository.js'
import { Router } from 'express';

const router = Router();

router.post('/operacion', async (req, res) => {
  const { toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle } = req.body
  try {
    const ress = await OperacionRepository.insert_operacion(toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle)
    res.json({ status:202, return: ress.recordsets })
  } catch (error) {
    res.json({ status: 404, msg: 'Error en conexion en base de datos.' })
  }
})

router.get('/operacion', async (req, res) => {
  try {
    const ress = await OperacionRepository.data_operacion()
    res.json({ status:202, return: ress.recordsets })
  } catch (error) {
    res.json({ status: 404, msg: "Error en conexion a la base de datos" })
  }
})

export default router