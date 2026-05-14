/**
 * Pub/sub trong bộ nhớ cho SSE bình luận theo từng post.
 *
 * Cấu trúc: rooms = Map<postId, Set<res>> — mỗi response là một client đang lắng nghe.
 * Hạn chế đã biết: chỉ hoạt động trong một process. Nếu scale ngang (PM2 cluster, nhiều
 * instance) phải đổi sang Redis Pub/Sub hoặc message bus thật. Với app demo hiện tại
 * (1 process Express) là đủ.
 */

const rooms = new Map();

export function subscribe(postId, res) {
    if (!postId) return;
    const key = String(postId);
    if (!rooms.has(key)) rooms.set(key, new Set());
    rooms.get(key).add(res);
}

export function unsubscribe(postId, res) {
    if (!postId) return;
    const key = String(postId);
    const set = rooms.get(key);
    if (!set) return;
    set.delete(res);
    if (set.size === 0) rooms.delete(key);
}

/**
 * Phát một SSE event tới mọi client đang xem post.
 * @param {string} postId
 * @param {string} event - tên event (vd: 'comment:new').
 * @param {object} data  - sẽ được JSON.stringify.
 */
export function emit(postId, event, data) {
    if (!postId) return;
    const set = rooms.get(String(postId));
    if (!set || set.size === 0) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of set) {
        try {
            res.write(payload);
        } catch {
            /* client đã ngắt — req.on('close') sẽ unsubscribe sau */
        }
    }
}

export function roomSize(postId) {
    return rooms.get(String(postId))?.size ?? 0;
}
