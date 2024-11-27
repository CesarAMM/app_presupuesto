import {Router} from 'express'

const router = Router();

router.get('/index', (req, res)=>{
  res.render("balance.views.html", {title: "Ingreso de Operaciones"})
})

export default router;