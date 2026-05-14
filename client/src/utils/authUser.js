/* Tiện ích đọc profile + user id đã lưu, dùng chung cho thunk (optimistic
   update) và component UI (isMine check). Tránh lặp logic ở nhiều chỗ.

   Thứ tự ưu tiên (RẤT QUAN TRỌNG):
   1. `_id` — sau pass PROF-1 Phase M, MỌI user (local + Google) đều có doc
      trong DB với `_id` ObjectId. Đây là id chuẩn cần dùng cho mọi flow.
   2. `googleId` — phòng trường hợp doc cũ kì lạ chỉ có googleId mà thiếu _id.
   3. `sub` — fallback cho session CŨ chưa refresh sau Phase M (localStorage
      còn lưu Google decoded payload trực tiếp; user phải logout + login lại
      để có doc đầy đủ).

   BUG cũ: thứ tự đảo (sub → googleId → _id) làm Google user sau Phase M
   vẫn dùng `sub` làm id (vì User doc trả về có cả `googleId`) → mọi request
   profile dùng sai id → 404. */

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
    const id = r._id ?? r.googleId ?? r.sub;
    return id != null ? String(id) : null;
};
