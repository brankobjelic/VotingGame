import { Router } from 'express';
import { getRandomJoke, submitVote } from '../controllers/jokeController';

const router = Router();

router.get('/api/joke', getRandomJoke);
router.post('/api/joke/:id', submitVote);

export default router;