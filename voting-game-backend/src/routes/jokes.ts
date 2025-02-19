import { Router } from 'express';
import { getRandomJoke, submitVote, deleteJoke, updateJoke } from '../controllers/jokeController';

const router = Router();

router.get('/api/joke', getRandomJoke);
router.post('/api/joke/:id', submitVote);
router.delete('/api/joke/:id', deleteJoke);
router.put('/api/joke/:id', updateJoke);

export default router;