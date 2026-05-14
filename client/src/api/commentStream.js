/**
 * Kết nối SSE để nhận bình luận realtime cho một post.
 *
 * Dùng EventSource (built-in trình duyệt) — không cần thư viện ngoài.
 * EventSource sẽ tự reconnect khi mất kết nối, nên client không cần code lại.
 *
 * GOTCHA: CRA dev proxy (mặc định trong package.json "proxy") buffer response
 * text/event-stream → client KHÔNG nhận event tới khi connection đóng. Vì vậy
 * trong dev ta cố ý bỏ qua proxy và gọi thẳng http://<host>:5000.
 * `cors()` trên server cho phép mọi origin nên không cần preflight.
 *
 *  - Prod: dùng REACT_APP_API_URL nếu API ở domain khác, hoặc relative URL nếu cùng origin.
 *  - Dev (CRA port 3000): tự đoán backend ở cùng host port 5000.
 */

function resolveApiBase() {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return '';
}

const API_BASE = resolveApiBase();

/**
 * @param {string} postId
 * @param {{
 *   onReady?: (data: { postId: string }) => void,
 *   onNewComment?: (data: { postId: string, comment: string, comments: string[] }) => void,
 *   onLikeUpdate?: (data: { postId: string, likes: string[] }) => void,
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

  es.addEventListener('like:update', (e) => {
    const data = safeJson(e.data);
    if (data && handlers.onLikeUpdate) handlers.onLikeUpdate(data);
  });

  if (handlers.onError) es.onerror = handlers.onError;

  return () => {
    try { es.close(); } catch { /* ignore */ }
  };
}
