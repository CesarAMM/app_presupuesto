import OperacionContext from '../context/operacion.context.js';
import OperacionRepository from '../repository/operaciones.repository.js';
import { Router } from 'express';
const router = Router();
router.post('/insert_operacion', async (req, res) => {
    const { VLTOperacion, VLCategoria, VLSubcategoria, VLCuenta, VLMonto, VLFecha, VLTCategoria, VLResponsable } = req.body;
    const VLRespuesta = await OperacionRepository.insert_operacion(VLTOperacion, VLCategoria, VLSubcategoria, VLCuenta, VLMonto, VLFecha, VLTCategoria, VLResponsable);
    res.json({ VLRespuesta });
});
router.post('/insert_det_operacion', async (req, res) => {
    const { VTOperacion, VTCodigo, VTDescripcion, VTMedida, VTCantidad, VTMonto } = req.body;
    const VLRespuesta = await OperacionRepository.insert_det_operacion(VTOperacion, VTCodigo, VTDescripcion, VTMedida, VTCantidad, VTMonto);
    res.json(VLRespuesta);
});
router.get('/operacion', async (req, res) => {
    const ress = await OperacionRepository.data_operacion();
    res.json(OperacionContext.getOperacion(ress.recordset));
});
router.get('/estado_cuenta', async (req, res) => {
    const VLRespuesta = await OperacionRepository.estado_cuenta();
    res.json(VLRespuesta);
});
export default router;
