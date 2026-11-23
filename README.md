# DxH-Portal — https://dxh3001.pages.dev/

Trang cổng các ứng dụng của Công ty Nghĩa Sơn.

| Đường dẫn | Ứng dụng | Repo |
|---|---|---|
| `/` | Trang cổng | repo này (`site/`) |
| `/pdf-editor/` | PDF Editor | dxhrelax3001-star/PDF-Editor-by-DxH |
| `/load-planner/` | Load Planner | dxhrelax3001-star/Load-Planner |

## Tự cập nhật
Cloudflare Pages (project `dxh3001`) chạy `node build.js --remote`: tải bản mới nhất của từng ứng dụng
từ GitHub rồi gộp vào `dist/`. Build lại tự động khi:
- push repo này, hoặc
- push repo một ứng dụng: GitHub Action `.github/workflows/update-portal.yml` trong repo đó gọi deploy hook
  (secret `PORTAL_DEPLOY_HOOK`).

## Xem thử trên máy
`node build.js` (lấy code từ các thư mục trên máy) → `node serve.js` → http://localhost:3400

## Thêm ứng dụng mới
1. Thêm 1 dòng vào `APPS` trong `build.js` và 1 ô trong `site/index.html`.
2. Trong repo ứng dụng: thêm secret `PORTAL_DEPLOY_HOOK` + file `.github/workflows/update-portal.yml`.
3. Dữ liệu lưu trong trình duyệt (localStorage/IndexedDB) đặt tên có tiền tố riêng của ứng dụng.
