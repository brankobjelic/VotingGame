import { Request, Response } from 'express';
import { Joke } from '../models/Joke';

export const getRandomJoke = async (req: Request, res: Response) => {
  try {
    const count = await Joke.countDocuments();
    const random = Math.floor(Math.random() * count);
    const joke = await Joke.findOne().skip(random);
    
    if (!joke) {
      return res.status(404).json({ message: 'No jokes found' });
    }

    res.json(joke);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};