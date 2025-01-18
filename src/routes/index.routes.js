import {Router} from 'express'

const router = Router();

router.get('/ingreso_operaciones', (req, res)=>{
  res.render("operaciones.html", {title: "Ingreso de Operaciones"})
})

router.get('/reporte', (req, res)=>{
  res.render("reporte.html", {title: "Reporte de Operaciones"})
})

export default router;