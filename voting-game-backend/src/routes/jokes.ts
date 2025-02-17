import { Router } from 'express';
import { getRandomJoke } from '../controllers/jokeController';

const router = Router();

router.get('/api/joke', getRandomJoke);

export default router;