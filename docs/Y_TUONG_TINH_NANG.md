# Ý tưởng tính năng cho Memories

Các hướng **sản phẩm / UX** làm app “kỷ niệm” thú vị hơn — bổ sung cho checklist kỹ thuật trong [MO_RONG_DU_AN.md](./MO_RONG_DU_AN.md).

---

## Gắn với ý nghĩa “kỷ niệm”

- **Dòng thời gian (timeline)** — xem bài theo tháng/năm như album (dùng `createdAt` hoặc thêm field “ngày sự kiện”).
- **Ngày kỷ niệm** — lưu ngày diễn ra + gợi ý “một năm trước hôm nay” hoặc nhắc nhẹ (email / thông báo).
- **Album / bộ sưu tập** — gom nhiều post vào một album (du lịch 2025, sinh nhật…).
- **Ảnh bìa + trích đoạn** — subtitle hoặc một câu highlight để feed giống magazine.

---

## Tương tác xã hội nhẹ

- **Phản ứng ngoài like** — ❤️ 😂 🙏 (quy tắc đơn giản: mỗi người một loại hoặc nhiều loại).
- **Bookmark / Lưu** — lưu memory của người khác (kèm đăng nhập).
- **Chia sẻ có preview** — Open Graph cho `/posts/:id` khi gửi link.
- **Bình luận nâng cao** — reply theo thread hoặc @mention nếu có danh sách user.

---

## Khám phá nội dung

- **Bản đồ kỷ niệm** — địa điểm (tọa độ hoặc địa chỉ) + marker trên map.
- **“On this day”** — ôn lại post cùng ngày các năm trước.
- **Tag trending / gợi ý tag** — khi đang gõ hoặc tìm.
- **Lưới / masonry** — nhiều ảnh, layout khác feed dọc.

---

## Cá nhân hóa

- **Chủ đề giao diện** — sáng/tối hoặc season (Tết, lễ…).
- **Trang hồ sơ** — avatar, bio, lưới bài của mình, số liệu tóm tắt.
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
