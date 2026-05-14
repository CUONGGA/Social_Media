import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import * as commentBus from "../realtime/commentBus.js";

export const getposts = async (req, res, next) => {
    const { page } = req.query;

    try {
        const LIMIT = 9;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        const postMessage = await PostMessage.find();

        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch(err) {
        res.status(404).json({
            message: err.message
        })
    }
}

export const getPost = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch(err) {
        res.status(404).json({
            message: err.message
        })
    }
}

export const getPostsBySearch = async (req, res, next) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res, next) => {
    const post = req.body;  
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
    try{
        await newPost.save();

        res.status(201).json(newPost);
    }catch(err){
        res.status(409).json({
            message: err.message
        })
    }
}

export const updatePost = async (req, res, next) => {
    const { id: _id } = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Not Found!');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ... post, _id }, {new: true});

    res.json(updatedPost);
}

export const deletePost = async (req, res, next) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Not Found!');

    await PostMessage.findByIdAndDelete(id);

    console.log('DELETE');

    res.json({message: 'Post deleted successful!'});
}

export const likePost = async (req, res, next) => {
    const { id } = req.params;

    if (!req.userId) return res.json({message: 'Unauthenticated'});

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Not Found!');

    const post = await PostMessage.findById(id);    

    const index = post.likes.findIndex((id) => String(id) === String(req.userId));

    if (index === -1) {
        post.likes.push(String(req.userId));
    } else {
        post.likes = post.likes.filter((id) => String(id) !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}

export const commentPost = async (req, res, next) => {
    const { id } = req.params;
    const { value } = req.body;

    if (!req.userId) return res.json({message: 'Unauthenticated'});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('Not Found!');

    const post = await PostMessage.findById(id);

    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id
        , post, { new: true });

    /* Phát comment tới mọi client đang mở trang chi tiết bài này.
       Gửi cả 'comment' (raw) và 'comments' (mảng chuẩn từ DB) — client chọn dùng cái nào. */
    commentBus.emit(id, 'comment:new', {
        postId: String(id),
        comment: value,
        comments: updatedPost.comments,
    });

    res.json(updatedPost);
}

/**
 * SSE stream cho bình luận của 1 post.
 * Public (không cần auth) — bất kỳ ai mở trang chi tiết đều có thể nhận event mới.
 */
export const streamComments = (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).end();
    }

    res.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        /* Tắt buffering trên reverse proxy phổ biến (nginx) — không có hại nếu không dùng proxy */
        'X-Accel-Buffering': 'no',
    });
    res.flushHeaders?.();

    /* Báo client đã sẵn sàng (cũng giúp axios/fetch không bị stuck chờ first byte). */
    res.write(`event: ready\ndata: ${JSON.stringify({ postId: String(id) })}\n\n`);

    /* Heartbeat 25s — giữ kết nối qua proxy/loadbalancer hay đóng idle 30s+. */
    const heartbeat = setInterval(() => {
        try { res.write(': ping\n\n'); } catch { /* ignore */ }
    }, 25_000);

    commentBus.subscribe(id, res);

    const cleanup = () => {
        clearInterval(heartbeat);
        commentBus.unsubscribe(id, res);
    };

    req.on('close', cleanup);
    req.on('aborted', cleanup);
};

