import express from 'express'
import connectDB from './config/db';
import jokeRoutes from './routes/jokes';


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use(jokeRoutes);

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})