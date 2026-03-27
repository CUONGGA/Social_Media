import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import postsRouter from './routes/posts.js'
import userRouter from './routes/users.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({limit: "30mb"}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use((req, res, next) => {
  console.log("👉 HIT:", req.method, req.url);
  next();
});
app.use('/posts', postsRouter);
app.use('/user', userRouter); 

const PORT = process.env.PORT || 5000; 
mongoose.connect(process.env.CONNECTION_URL)  
  .then(() => app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log('Connected to DB!!');
  }))
  .catch((err) => console.log(err));