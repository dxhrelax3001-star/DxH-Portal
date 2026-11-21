# DxH-Portal — https://dxh3001.pages.dev/

Trang cổng các ứng dụng của Công ty Nghĩa Sơn.

| Đường dẫn | Ứng dụng | Code gốc trên máy |
|---|---|---|
| `/` | Trang cổng | `site/` |
| `/pdf-editor/` | PDF Editor | `../pdf-editor/PDF-Editor-by-DxH` |
| `/load-planner/` | Load Planner | `../load-planner/Load Planner` |

Cập nhật web: chạy `Cap-nhat-web.cmd` (gom vào `dist/`) → GitHub Desktop: Commit + Push.
Cloudflare Pages: build command để trống, output directory = `dist`.

Thêm ứng dụng: thêm 1 dòng vào `APPS` trong `build.js` và `site/index.html`.
