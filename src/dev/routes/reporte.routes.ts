import ReporteRepository from '../repository/reporte.repository.js'
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/ReporteData', async (req: Request, res: Response) => {
  const ress = await ReporteRepository.data_operacion();
  console.log(ress)
  res.json(ress)
})

export default router