import { Router } from 'express';
import * as authControllers from '../controller/auth';

import authMiddleware from '../middleware/authentication';

const router = Router();

// POST Requests
router.post('/login', authControllers.login);
router.post('/register', authControllers.register);

// GET Requests
router.get('/profile', authMiddleware, authControllers.profile);

// PUT Requests
router.put('/profile', authMiddleware, authControllers.updateStaff);

export default router;
