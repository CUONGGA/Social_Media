# Ý tưởng tính năng cho Memories

Các hướng **sản phẩm / UX** làm app "kỷ niệm" thú vị hơn — bổ sung cho checklist kỹ thuật trong [MO_RONG_DU_AN.md](./MO_RONG_DU_AN.md) và backlog vấn đề cụ thể trong [VanDeCanGiaiQuyet.md](./VanDeCanGiaiQuyet.md).

> **Đã làm:**
> - Bình luận realtime trên trang chi tiết (SSE — phạm vi S của hướng "chat realtime"). Nhật ký: [ngay2.md](./ngay2.md).
> - Live like count realtime (A1). Nhật ký: [ngay2.md](./ngay2.md).
> - Trang hồ sơ MVP — `/users/:id` + `/me`. Nhật ký: [ngay2.md — Trang hồ sơ](./ngay2.md#trang-hồ-sơ--phạm-vi-s-mvp-cùng-ngày).

---

## Gắn với ý nghĩa “kỷ niệm”

- **Dòng thời gian (timeline)** — xem bài theo tháng/năm như album (dùng `createdAt` hoặc thêm field “ngày sự kiện”).
- **Ngày kỷ niệm** — lưu ngày diễn ra + gợi ý “một năm trước hôm nay” hoặc nhắc nhẹ (email / thông báo).
- **Album / bộ sưu tập** — gom nhiều post vào một album (du lịch 2025, sinh nhật…).
- **Ảnh bìa + trích đoạn** — subtitle hoặc một câu highlight để feed giống magazine.

---

## Tương tác xã hội nhẹ

- ✅ **Bình luận realtime** — comment mới hiện ngay không cần F5 (SSE per-post). Xem [ngay2.md](./ngay2.md).
- **Phản ứng ngoài like** — ❤️ 😂 🙏 (quy tắc đơn giản: mỗi người một loại hoặc nhiều loại). *(Đang hoãn — xem [PHAN_UNG_DA_TRIEN_KHAI.md](./PHAN_UNG_DA_TRIEN_KHAI.md))*
- **Bookmark / Lưu** — lưu memory của người khác (kèm đăng nhập).
- **Chia sẻ có preview** — Open Graph cho `/posts/:id` khi gửi link.
- **Bình luận nâng cao** — reply theo thread hoặc @mention nếu có danh sách user. *(Cần refactor comment schema sang object trước — xem MO_RONG_DU_AN.md mục 3.)*
- **DM 1–1 giữa user** — phạm vi M của hướng realtime, dùng Socket.IO. Nên làm sau khi có trang hồ sơ user.
- **Live like count** — cùng pattern SSE như comment, hiển thị số like tăng/giảm realtime trên trang chi tiết.
- **Bell / Thông báo realtime** — báo khi bài mình bị like/comment; SSE kênh `user:{id}`.

---

## Khám phá nội dung

- **Bản đồ kỷ niệm** — địa điểm (tọa độ hoặc địa chỉ) + marker trên map.
- **“On this day”** — ôn lại post cùng ngày các năm trước.
- **Tag trending / gợi ý tag** — khi đang gõ hoặc tìm.
- **Lưới / masonry** — nhiều ảnh, layout khác feed dọc.

---

## Cá nhân hóa

- **Chủ đề giao diện** — sáng/tối hoặc season (Tết, lễ…).
- ✅ **Trang hồ sơ** — MVP đã làm: avatar (initial), tên, ngày tham gia, số bài, lưới bài. Còn thiếu: bio + edit + avatar thật → xem [ngay2.md — Hạn chế đã biết](./ngay2.md#hạn-chế-đã-biết-sang-phạm-vi-m).
- **Riêng tư / công khai** — post `private` chỉ mình xem (khi đã có auth vững).

---

## Sáng tạo nội dung

- **Template gợi ý** — “Ngày đầu tiên…”, “Cảm ơn vì…” với mẫu tiêu đề.
- **Draft / nháp** — lưu chưa publish.
- **Nhiều ảnh một bài** — carousel thay vì một file đơn.

---

## Polish / niềm vui nhỏ

- **Animation nhẹ** khi đăng bài thành công (có tắt trong cài đặt).
- **Export “năm của tôi”** — PDF hoặc ảnh tổng hợp (marketing cá nhân).

---

## Gợi ý ưu tiên khi bắt tay code (MERN hiện tại)

Các mục **vừa thấy rõ trên UI, vừa ít phụ thuộc hạ tầng ngoài** trước: timeline + album, bookmark, carousel nhiều ảnh, map + địa điểm.
