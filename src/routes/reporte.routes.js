import ReporteRepository from '../repository/reporte.repository.js'
import { Router } from 'express';

const router = Router();

router.get('/ReporteData', async (req, res) => {
  const ress = await ReporteRepository.data_operacion();
  console.log(ress)
  res.json(ress)
})

export default router