import { Router } from 'express'
import { getClasificacionesGasto, postClasificacionGasto } from '../controllers/metadata.controller'
import { getSelMetadaOperaciones } from '../controllers/operaciones.controller';

const router = Router();

router.get('/clasificacion_gasto',  getClasificacionesGasto)
router.post('/clasificacion_gasto', postClasificacionGasto)
router.get('/metadatos_operaciones', getSelMetadaOperaciones)

export default router;