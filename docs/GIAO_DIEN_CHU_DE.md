# Giao diện sáng / tối (theme)

## Đã triển khai

- **Hai chế độ:** Sáng (mặc định) và tối, dùng **Material-UI v4** `createMuiTheme` với palette tách bạch: nền, giấy (`paper`), chữ (`text`), `primary` / `secondary` indigo và hồng, divider và shadow phù hợp từng mode.
- **Bật/tắt:** Nút icon trên **Navbar** (mặt trăng = chuyển sang tối, mặt trời = chuyển sang sáng), có tooltip tiếng Việt.
- **Lưu lựa chọn:** `localStorage` key **`memory-ui-theme`** — giá trị `light` hoặc `dark`. Reload hoặc mở tab mới vẫn giữ theme.
- **Tránh nháy màu lúc tải:** Trong `public/index.html` có đoạn script nhỏ chạy trước React để gán `data-theme` lên `<html>` và `<body>` theo cùng key storage.
- **Nền toàn trang:** `index.css` dùng gradient khác nhau cho `body[data-theme="light"]` và `body[data-theme="dark"]`; shadow `MuiPaper` cũng tách theo theme.
- **Component dùng palette:** Navbar, Home (ô tìm kiếm, chip, phân trang), Form tạo bài, Auth, thẻ Post, danh sách Posts, chi tiết bài (thumbnail gợi ý), Pagination — giảm màu cứng (`#fff`, `#222`, …) để đồng bộ với theme.

## File chính (client)

| Vai trò | Đường dẫn |
|--------|------------|
| Định nghĩa theme MUI | `src/theme/buildTheme.js` |
| Context + `ThemeProvider` + `CssBaseline` + lưu storage | `src/context/ThemeModeContext.js` |
| Bọc app | `src/index.js` |
| Nút đổi theme | `src/components/Navbar/navbar.js` |

Hook dùng trong code: `import { useThemeMode } from '../context/ThemeModeContext'` → `{ mode, toggleMode, setMode }`.

## Mở rộng gợi ý

- Đồng bộ `meta theme-color` với màu toolbar mobile.
- Tuỳ chọn “theo hệ thống” (`prefers-color-scheme`) rồi vẫn cho người dùng ghi đè thủ công.
