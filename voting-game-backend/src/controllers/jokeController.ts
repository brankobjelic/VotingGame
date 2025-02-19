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

export const submitVote = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { vote } = req.body;
  
    try {
      const joke = await Joke.findOne({ id });
      if (!joke) {
        return res.status(404).json({ message: 'Joke not found' });
      }
  
      // Check if the vote is valid
      if (!joke.availableVotes.includes(vote)) {
        return res.status(400).json({ message: 'Invalid vote' });
      }
  
      // Update the votes
      const existingVote = joke.votes.find(v => v.label === vote);
      if (existingVote) {
        existingVote.value += 1; // Increment the vote count
      } else {
        joke.votes.push({ value: 1, label: vote }); // Add a new vote
      }
  
      // Save the updated joke
      await joke.save();
      res.status(200).json(joke);
    } catch (error) {
      console.error('Error submitting vote:', error);
      res.status(500).json({ message: 'Server error' });
    }
};

export const deleteJoke = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const joke = await Joke.findOne({ id });

        if (!joke) {
          return res.status(404).json({ message: 'No jokes found' });
        }
        await joke.deleteOne();
        res.status(200).json({ message: 'Joke deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    } 
};

export const updateJoke = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { question, answer } = req.body;
  
    try {
      const joke = await Joke.findOne({ id });
      if (!joke) {
        return res.status(404).json({ message: 'Joke not found' });
      }
  
      joke.question = question;
      joke.answer = answer;
  
      await joke.save();
      res.status(200).json(joke);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}