import {Response, Request, Router} from 'express';
import GeneralesRepository from '../repository/generales.repository.js';
import ContextGeneral from '../context/general.context.js';

const router = Router();

router.post('/catalogo', async (req: Request, res: Response) => {
    res.json(await ContextGeneral.getcCatalogo(await GeneralesRepository.data_catalogo(req)));
})


export default router;