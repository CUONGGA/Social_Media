import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import * as commentBus from "../realtime/commentBus.js";

export const getposts = async (req, res, next) => {
    const { page } = req.query;

    try {
        const LIMIT = 9;
        const startIndex = (Math.max(Number(page) || 1, 1) - 1) * LIMIT;

        /* Chạy song song để tiết kiệm 1 roundtrip DB. Trước đây dùng 2 await
           tuần tự (count rồi find), giờ Promise.all → tổng latency ~ max(count, find)
           thay vì count + find. */
        const [total, posts] = await Promise.all([
            PostMessage.countDocuments({}),
            PostMessage.find()
                .sort({ _id: -1 })
                .limit(LIMIT)
                .skip(startIndex)
                .lean(), /* lean() bỏ Mongoose hydration → JS object thuần, nhẹ hơn ~30% */
        ]);

        /* CHÚ Ý: trước đây có dòng `const postMessage = await PostMessage.find();`
           fetch TOÀN BỘ posts (gồm cả base64 selectedFile) rồi vứt vào biến không
           dùng → mỗi lần load Home đốt MB IO DB vô ích. Đã xoá. */

        res.status(200).json({
            data: posts,
            currentPage: Math.max(Number(page) || 1, 1),
            numberOfPages: Math.ceil(total / LIMIT),
        });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    try {
        const post = await PostMessage.findById(id).lean();
        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPostsBySearch = async (req, res, next) => {
    const { searchQuery, tags } = req.query;

    /* Defensive: trước đây nếu `tags` undefined sẽ crash `.split` → 500. */
    const tagList = typeof tags === 'string' && tags.length > 0 ? tags.split(',') : [];
    const hasSearch = typeof searchQuery === 'string' && searchQuery.length > 0 && searchQuery !== 'none';

    try {
        const filter = (() => {
            if (hasSearch && tagList.length > 0) {
                return { $or: [{ title: new RegExp(searchQuery, 'i') }, { tags: { $in: tagList } }] };
            }
            if (hasSearch) return { title: new RegExp(searchQuery, 'i') };
            if (tagList.length > 0) return { tags: { $in: tagList } };
            return {}; /* không có tiêu chí → trả mảng rỗng phía dưới để khỏi quét full collection */
        })();

        if (!hasSearch && tagList.length === 0) {
            return res.json({ data: [] });
        }

        /* Giới hạn 20 kết quả cho 1 search/related call.
           - Home search: user thường chỉ xem ~vài chục bài đầu.
           - PostDetails related ("You might also like"): UI chỉ hiện vài bài.
           - Tránh fetch hàng ngàn doc kèm base64 khi DB lớn. */
        const posts = await PostMessage.find(filter)
            .sort({ _id: -1 })
            .limit(20)
            .lean();

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

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

/* Helper: lấy post + check ownership. Trả về `{ post }` hoặc gửi response lỗi
   và return null để caller dừng lại.
   - 404: id sai format / post không tồn tại
   - 403: post tồn tại nhưng không phải owner */
const loadPostAsOwner = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ message: 'Post not found' });
        return null;
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return null;
    }

    if (String(post.creator) !== String(req.userId)) {
        /* Cố ý trả 403 (không phải 404) khi đã xác thực nhưng không có quyền —
           đúng theo RFC 9110. Không lo "leak existence" vì client đã thấy bài
           ở Home/Detail trước đó. */
        res.status(403).json({ message: 'Only the post owner can do that' });
        return null;
    }

    return post;
};

export const updatePost = async (req, res, next) => {
    const owned = await loadPostAsOwner(req, res);
    if (!owned) return;

    const { id: _id } = req.params;
    const body = req.body;

    /* Không cho client ghi đè `creator` (chống leo quyền vô tình hay cố ý). */
    const { creator: _ignored, _id: __ignored, ...safeFields } = body;

    const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        { ...safeFields, _id },
        { new: true },
    );

    res.json(updatedPost);
};

export const deletePost = async (req, res, next) => {
    const owned = await loadPostAsOwner(req, res);
    if (!owned) return;

    const { id } = req.params;
    await PostMessage.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully' });
};

export const likePost = async (req, res, next) => {
    const { id } = req.params;

    /* Phòng thủ thừa: middleware `auth` đã chặn nếu thiếu/sai token, nhưng vẫn
       trả 401 đúng chuẩn ở đây phòng trường hợp route quên gắn middleware. */
    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    /* Tối ưu so với phiên bản trước:
       - CHỈ đọc field `likes` (projection), không kéo `selectedFile` base64 vài MB.
       - Update atomic với `$addToSet` / `$pull` thay vì load-modify-save full document.
       - Trả về projection `{ _id, likes }` thay vì cả post — client merge reducer xử lý partial. */
    const current = await PostMessage.findById(id, { likes: 1 });
    if (!current) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const userId = String(req.userId);
    const isLiked = (current.likes || []).some((u) => String(u) === userId);

    const op = isLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } };

    const updatedPost = await PostMessage.findByIdAndUpdate(id, op, {
        new: true,
        projection: { likes: 1 },
    });

    /* Phát số like mới tới mọi client đang mở trang chi tiết bài này.
       Gửi payload nhỏ (chỉ _id + likes) để client merge vào state hiện có. */
    commentBus.emit(id, 'like:update', {
        postId: String(id),
        likes: updatedPost.likes,
    });

    /* Trả slim response → bớt băng thông + parse JSON ở client.
       Client reducer LIKE đã merge thay vì replace nên không mất các field khác. */
    res.json({ _id: String(updatedPost._id), likes: updatedPost.likes });
};

export const commentPost = async (req, res, next) => {
    const { id } = req.params;
    const { value } = req.body;

    if (!req.userId) return res.status(401).json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const post = await PostMessage.findById(id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    /* Phát comment tới mọi client đang mở trang chi tiết bài này.
       Gửi cả 'comment' (raw) và 'comments' (mảng chuẩn từ DB) — client chọn dùng cái nào. */
    commentBus.emit(id, 'comment:new', {
        postId: String(id),
        comment: value,
        comments: updatedPost.comments,
    });

    res.json(updatedPost);
};

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

