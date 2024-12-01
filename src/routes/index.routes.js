import {Router} from 'express'

const router = Router();

router.get('/ingreso_operaciones', (req, res)=>{
  res.render("operaciones.html", {title: "Ingreso de Operaciones"})
})

export default router;