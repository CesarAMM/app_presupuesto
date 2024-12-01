import OperacionRepository from '../repository/operaciones.repository.js'
import { Router } from 'express';

const router = Router();

router.post('/operacion', async (req, res) => {
  const { toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle } = req.body
  const ress = await OperacionRepository.insert_operacion(toperacion, tcategoria, tsubcategoria, cuenta, monto, fecha, detalle)
  console.log(ress)
  res.json({ operacion: 'Existosa' })
})

router.get('/operacion', async (req, res) => {
  console.log('router: dice hola')
  const ress = await OperacionRepository.data_operacion()
  console.log(ress)
  res.json({ operacion: 'Existosa' })
})

export default router