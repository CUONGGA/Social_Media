/**
 * Kết nối SSE để nhận bình luận realtime cho một post.
 *
 * Dùng EventSource (built-in trình duyệt) — không cần thư viện ngoài.
 * EventSource sẽ tự reconnect khi mất kết nối, nên client không cần code lại.
 *
 * Trong dev (CRA), URL tương đối /posts/... được proxy về http://localhost:5000
 * theo cấu hình "proxy" trong package.json.
 * Trong prod, đặt REACT_APP_API_URL nếu API ở domain khác.
 */

const API_BASE = process.env.REACT_APP_API_URL || '';

/**
 * @param {string} postId
 * @param {{
 *   onReady?: (data: { postId: string }) => void,
 *   onNewComment?: (data: { postId: string, comment: string, comments: string[] }) => void,
 *   onError?: (event: Event) => void,
 * }} handlers
 * @returns {() => void} hàm đóng kết nối, gọi khi unmount.
 */
export function openCommentStream(postId, handlers = {}) {
  if (!postId || typeof window === 'undefined' || typeof window.EventSource !== 'function') {
    return () => {};
  }

  const url = `${API_BASE}/posts/${postId}/comments/stream`;
  const es = new window.EventSource(url);

  const safeJson = (raw) => {
    try { return JSON.parse(raw); } catch { return null; }
  };

  es.addEventListener('ready', (e) => {
    const data = safeJson(e.data);
    if (data && handlers.onReady) handlers.onReady(data);
  });

  es.addEventListener('comment:new', (e) => {
    const data = safeJson(e.data);
    if (data && handlers.onNewComment) handlers.onNewComment(data);
  });

  if (handlers.onError) es.onerror = handlers.onError;

  return () => {
    try { es.close(); } catch { /* ignore */ }
  };
}
