import { Router } from 'express'
import { getClasificacionesGasto } from '../controllers/metadata.controller'

const router = Router();

router.get('/clasificacion_gasto', getClasificacionesGasto)

export default router;