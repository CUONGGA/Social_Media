import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import postsRouter from './routes/posts.js'
import userRouter from './routes/users.js';

dotenv.config();
const app = express();

app.use(cors());

/* Gzip toàn bộ response. Đặt TRƯỚC các route handler.
   Loại trừ SSE stream — vì compression buffer output theo chunk, sẽ giữ event
   lại tới khi đủ buffer → mất tính realtime. Filter theo URL vì Content-Type
   chỉ được set bên trong controller, sau khi middleware đã quyết định. */
const isSseRoute = (req) =>
  req.path.endsWith('/comments/stream') || req.path.endsWith('/stream');

app.use(compression({
  filter: (req, res) => {
    if (isSseRoute(req)) return false;
    return compression.filter(req, res);
  },
}));

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