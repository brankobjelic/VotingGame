import mongoose, { Schema, Document } from 'mongoose';

// Define the IVote interface representing a vote structure
export interface IVote {
  value: number;
  label: string;
}

// Define the IJoke interface that extends mongoose Document for a joke structure
export interface IJoke extends Document {
  id: string;
  question: string;
  answer: string;
  votes: IVote[];
  availableVotes: string[];
}

// Define the VoteSchema to structure the vote data
const VoteSchema: Schema = new Schema({
  value: { type: Number, required: true },
  label: { type: String, required: true },
});

// Define the JokeSchema to structure the joke data
const JokeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  votes: { type: [VoteSchema], required: true },
  availableVotes: { type: [String], required: true },
});

// Create the Joke model from JokeSchema for MongoDB interaction
export const Joke = mongoose.model<IJoke>('Joke', JokeSchema);