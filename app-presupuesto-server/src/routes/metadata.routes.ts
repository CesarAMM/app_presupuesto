import { Router } from 'express'
import { getClasificacionesGasto, postClasificacionGasto } from '../controllers/metadata.controller'

const router = Router();

router.get('/clasificacion_gasto',  getClasificacionesGasto)
router.post('/clasificacion_gasto', postClasificacionGasto)

export default router;