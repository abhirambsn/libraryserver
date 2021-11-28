import { Router } from 'express';
import { Response } from 'express';

const router = Router();

router.get('/', (_, res: Response) => {
  return res.status(200).send('API Documentation');
});

export default router;
