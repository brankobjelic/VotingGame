import express from 'express'
import connectDB from './config/db';
import jokeRoutes from './routes/jokes';
import cors from 'cors';

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

app.use(jokeRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})