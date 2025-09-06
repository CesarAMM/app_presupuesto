import { Router } from 'express';
import PresupuestoRepository from '../repository/presupuesto.repository.js';
import ContextPresupuesto from '../context/presupuesto.context.js';

const router = Router();

router.get('/optener_datos_presupuesto', async (req, res) => {
    const respuesta = await PresupuestoRepository.data_presupuesto();
    ContextPresupuesto.DataPresupuesto(respuesta)
    res.json(respuesta.status ? ContextPresupuesto.DataPresupuesto(respuesta) : respuesta)
})

export default router