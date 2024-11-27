import {Router} from 'express'

const router = Router();

router.get('/index', (req, res)=>{
  res.render("balance.views.html", {title: "Ingreso de Estado", app:"Ingreso"})
})

export default router;