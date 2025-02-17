import mongoose, { Schema, Document } from 'mongoose';

export interface IVote {
  value: number;
  label: string;
}

export interface IJoke extends Document {
  id: string;
  question: string;
  answer: string;
  votes: IVote[];
  availableVotes: string[];
}

const VoteSchema: Schema = new Schema({
  value: { type: Number, required: true },
  label: { type: String, required: true },
});

const JokeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  votes: { type: [VoteSchema], required: true },
  availableVotes: { type: [String], required: true },
});

export const Joke = mongoose.model<IJoke>('Joke', JokeSchema);