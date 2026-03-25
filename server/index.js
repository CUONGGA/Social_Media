import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';

import postsRouter from './routes/posts.js'

const app = express();

app.use(cors());
app.use(express.json({limit: "30mb"}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use('/posts', postsRouter);




//https://www.mongodb.com/products/platform/atlas-database
const CONNECTION_URL = 'mongodb+srv://javascriptmastery:javascriptmastery123@cluster0.lbnmd2j.mongodb.net/';
const PORT = process.env.PORT || 5000; 

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    console.log('Connected to DB!!');
  }))
  .catch((err) => console.log(err));