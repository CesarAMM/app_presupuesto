import { Router } from 'express'
import { authUser } from '../controllers/auth.controller'

const router = Router();

router.post('/login_auth', authUser);

export default router;