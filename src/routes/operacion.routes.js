import OperacionRepository from '../repository/operaciones.repository.js'
import { Router } from 'express';

const router = Router();

router.post('/insert_operacion', async (req, res) => {
  const { VLTOperacion, VLCategoria, VLSubcategoria, VLCuenta, VLMonto, VLFecha } = req.body
  const VLRespuesta = await OperacionRepository.insert_operacion( VLTOperacion, VLCategoria, VLSubcategoria, VLCuenta, VLMonto, VLFecha )
  res.json({ VLRespuesta })
})

router.post('/insert_det_operacion', async (req, res) => {
  const {VTOperacion, VTCodigo, VTDescripcion, VTMedida, VTCantidad, VTMonto} = req.body
  const VLRespuesta = await OperacionRepository.insert_det_operacion(VTOperacion, VTCodigo, VTDescripcion, VTMedida, VTCantidad, VTMonto)
  res.json(VLRespuesta)
})

router.get('/operacion', async (req, res) => {
  const ress = await OperacionRepository.data_operacion()
  res.json({
      "TOPERACION": ress.recordsets[0],
      "CATEGORIA": ress.recordsets[1],
      "TCATEGORIA": ress.recordsets[2],
      "SUBCATEGORIA": ress.recordsets[3],
      "MATRIZ": ress.recordsets[4]
  })
})

router.get('/estado_cuenta', async (req, res) => {
  const VLRespuesta = await OperacionRepository.estado_cuenta();
  res.json(VLRespuesta)
})

export default router