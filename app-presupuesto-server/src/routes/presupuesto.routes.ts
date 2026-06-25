import {Router} from 'express';
import { postPresupuesto } from '../controllers/presupuesto.controller';

const router = Router();

router.post('/ingresar_presupuesto', postPresupuesto)

export default router;