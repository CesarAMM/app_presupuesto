import { Router } from 'express';
import GeneralesRepository from '../repository/generales.repository';
const router = Router();
router.get('/catalogo', async (req, res) => {
    console.log(req.body);
    const respuesta = await GeneralesRepository.data_catalogo(req);
    res.json(respuesta.status ? respuesta.data : { "status": false, "data": null });
});
export default router;
