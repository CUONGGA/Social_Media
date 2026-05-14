/* Tiện ích đọc profile + user id đã lưu, dùng chung cho thunk (optimistic
   update) và component UI (isMine check). Tránh lặp logic ở nhiều chỗ.

   Hỗ trợ cả 3 dạng id user vì 2 kiểu đăng nhập đang cùng tồn tại:
   - Local signin → JWT payload `id` → User._id
   - Google OAuth → JWT payload `sub`
   - Một số bản cũ → `googleId`
   Trả về kiểu string hoặc null. */

export const readStoredProfile = () => {
    try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('profile') : null;
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

export const getUserId = (user) => {
    const r = user?.result;
    if (!r) return null;
    const id = r.sub ?? r.googleId ?? r._id;
    return id != null ? String(id) : null;
};
