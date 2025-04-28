import mongoose from 'mongoose';
const connectDB = () =>
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => console.log(`Connected to DB`))
    .catch(err => console.error(`Failed to connect to DB`, err));

export default connectDB;
