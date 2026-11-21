// Gộp trang cổng + các ứng dụng vào thư mục dist/ (để đưa lên dxh3001.pages.dev)
//   node build.js            → lấy code ứng dụng từ các thư mục trên máy này
// Cấu trúc kết quả:
//   dist/index.html            trang cổng
//   dist/pdf-editor/...        PDF Editor
//   dist/load-planner/...      Load Planner
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Ứng dụng: thư mục con trên web ← thư mục nguồn trên máy
const APPS = [
  { slug: 'pdf-editor',   src: path.join(ROOT, '..', 'pdf-editor', 'PDF-Editor-by-DxH') },
  { slug: 'load-planner', src: path.join(ROOT, '..', 'load-planner', 'Load Planner') },
];

// Không đưa lên web: file chạy server trên máy, log, trang quản trị, file thử
const SKIP = new Set(['.git', '.gitignore', '.gitattributes', 'node_modules', 'logs', '_admin', '_test',
  'server.js', 'package.json', 'package-lock.json', 'README.md']);
const skip = (name) => SKIP.has(name) || /\.(cmd|bat|vbs|ps1|log)$/i.test(name);

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
copyDir(path.join(ROOT, 'site'), DIST);
for (const a of APPS) {
  if (!fs.existsSync(path.join(a.src, 'index.html'))) { console.error('Không thấy ứng dụng:', a.src); process.exit(1); }
  copyDir(a.src, path.join(DIST, a.slug));
  console.log('✓', a.slug, '←', a.src);
}
console.log('Xong → ' + DIST);
