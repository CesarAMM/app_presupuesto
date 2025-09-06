import {Request, Response, Router} from 'express'

const router = Router();

router.get('/ingreso_operaciones', (req: Request, res: Response)=>{
  res.render("operaciones.html", 
    {
      title: "Ingreso de Operaciones",
      user: "cemamo"
    })
})

router.get('/reporte', (req: Request, res: Response)=>{
  res.render("reporte.html", {title: "Reporte de Operaciones"})
})

router.get('/presupuesto', async (req: Request, res: Response) => {
  res.render("presupuesto.html", {title: "Presupuesto"})
})

export default router;