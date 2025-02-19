import { Request, Response } from 'express';
import { Joke } from '../models/Joke';

export const getRandomJoke = async (req: Request, res: Response) => {
  try {
    const count = await Joke.countDocuments();  // Get the total number of jokes
    const random = Math.floor(Math.random() * count);   // Generate a random number
    const joke = await Joke.findOne().skip(random); // Get a random joke using skip
    
    if (!joke) {
      return res.status(404).json({ message: 'No jokes found' });
    }

    res.json(joke); // Send the joke as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  // Send a 500 status code for server error
  } 
};

export const submitVote = async (req: Request, res: Response) => {
    const { id } = req.params;  // Get the joke ID from the request parameters
    const { vote } = req.body;  // Get the vote from the request body
  
    try {
      const joke = await Joke.findOne({ id });  // Find the joke by ID
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
      res.status(200).json(joke);   // Send the updated joke as a JSON response
    } catch (error) {
      console.error('Error submitting vote:', error);   // Log the error to the console
      res.status(500).json({ message: 'Server error' });    // Send a 500 status code for server error
    }
};

export const deleteJoke = async (req: Request, res: Response) => {
    const { id } = req.params;  // Get the joke ID from the request parameters
    try {
        const joke = await Joke.findOne({ id });    // Find the joke by ID

        if (!joke) {
          return res.status(404).json({ message: 'No jokes found' });
        }
        await joke.deleteOne(); // Delete the joke
        res.status(200).json({ message: 'Joke deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    } 
};

export const updateJoke = async (req: Request, res: Response) => {
    const { id } = req.params;  // Get the joke ID from the request parameters
    const { question, answer } = req.body;  // Get the question and answer from the request body
  
    try {
      const joke = await Joke.findOne({ id });  // Find the joke by ID
      if (!joke) {
        return res.status(404).json({ message: 'Joke not found' });
      }
  
      // Update the joke's question and answer
      joke.question = question;
      joke.answer = answer;
  
      await joke.save();
      res.status(200).json(joke);   // Send the updated joke as a JSON response
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
}