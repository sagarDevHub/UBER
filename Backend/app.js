// import dotenv from 'dotenv';
// dotenv.config();
// import cors from 'cors';
// import express from 'express';
// const app = express();
// import cookieParser from 'cookie-parser';
// import connectDB from './db/db.js';
// import userRoutes from './routes/user.routes.js';
// import captainRoutes from './routes/captain.routes.js';
// connectDB();

// app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use('/users', userRoutes);
// app.use('/captains', captainRoutes);

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

// export default app;

import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import userRoutes from './routes/user.routes.js';
import captainRoutes from './routes/captain.routes.js';
import errorHandler from './utils/errorHandler.js';
connectDB();

// Enhanced CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello world');
});

export default app;
