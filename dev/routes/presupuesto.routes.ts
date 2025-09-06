import { Request, Response, Router } from 'express';
import PresupuestoRepository from '../repository/presupuesto.repository.js';
import ContextPresupuesto from '../context/presupuesto.context.js';

const router = Router();

router.get('/optener_datos_presupuesto', async (req: Request, res: Response) => {
    const respuesta = await PresupuestoRepository.data_presupuesto();
    res.json(respuesta.status ? ContextPresupuesto.getPresupuesto(respuesta) : respuesta)
})

export default router