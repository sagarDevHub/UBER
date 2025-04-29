import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
connectDB();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello world');
});

export default app;
