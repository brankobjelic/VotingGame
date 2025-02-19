import { Router } from 'express';
import { getRandomJoke, submitVote, deleteJoke } from '../controllers/jokeController';

const router = Router();

router.get('/api/joke', getRandomJoke);
router.post('/api/joke/:id', submitVote);
router.delete('/api/joke/:id', deleteJoke);

export default router;