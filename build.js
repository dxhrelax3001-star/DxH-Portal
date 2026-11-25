// Gộp trang cổng + các ứng dụng vào thư mục dist/ (web dxh3001.pages.dev)
//   node build.js --remote   → tải code MỚI NHẤT của từng ứng dụng từ GitHub (Cloudflare chạy lệnh này)
//   node build.js            → lấy code từ các thư mục trên máy này (để xem thử trước khi push)
// Kết quả:
//   dist/index.html          trang cổng
//   dist/<slug>/...          từng ứng dụng
// Cloudflare tự build lại khi: push repo DxH-Portal, hoặc push repo của một ứng dụng
// (GitHub Action "Cap nhat web tong" trong repo ứng dụng gọi deploy hook).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const REMOTE = process.argv.includes('--remote');

// Thêm ứng dụng mới: thêm 1 dòng ở đây + 1 ô trong site/index.html
const APPS = [
  { slug: 'pdf-editor',   repo: 'https://github.com/dxhrelax3001-star/PDF-Editor-by-DxH.git',
    local: path.join(ROOT, '..', 'pdf-editor', 'PDF-Editor-by-DxH') },
  { slug: 'load-planner', repo: 'https://github.com/dxhrelax3001-star/Load-Planner.git',
    local: path.join(ROOT, '..', 'load-planner', 'Load Planner') },
];

// Không đưa lên web: file chạy server trên máy, log, trang quản trị, file thử, cấu hình GitHub
const SKIP = new Set(['.git', '.github', '.gitignore', '.gitattributes', 'node_modules', 'logs', '_admin', '_test',
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

const TMP = path.join(ROOT, '.src');
fs.rmSync(DIST, { recursive: true, force: true });
fs.rmSync(TMP, { recursive: true, force: true });
copyDir(path.join(ROOT, 'site'), DIST);

for (const a of APPS) {
  let src = a.local;
  if (REMOTE) {
    src = path.join(TMP, a.slug);
    execFileSync('git', ['clone', '--depth', '1', '--quiet', a.repo, src], { stdio: 'inherit' });
    const sha = execFileSync('git', ['-C', src, 'log', '-1', '--format=%h %s']).toString().trim();
    console.log('  ' + a.slug + ' @ ' + sha);
  }
  if (!fs.existsSync(path.join(src, 'index.html'))) { console.error('Không thấy ứng dụng:', src); process.exit(1); }
  copyDir(src, path.join(DIST, a.slug));
  console.log('✓', a.slug, '←', REMOTE ? a.repo : src);
}
// Ứng dụng chạy trên máy chủ công ty (không build vào đây): đường dẫn cố định dxh3001.pages.dev/<slug>/ chuyển tới link hiện tại.
// site/<slug>.json do máy chủ của ứng dụng tự cập nhật khi link đổi -> link trên web tổng không bao giờ phải sửa tay.
const EXTERNAL = ['ai-packing'];
const redirects = [];
for (const slug of EXTERNAL) {
  try {
    const info = JSON.parse(fs.readFileSync(path.join(ROOT, 'site', slug + '.json'), 'utf8'));
    const url = String(info.url || '').replace(/\/+$/, '');
    if (!/^https:\/\/[^\s]+$/.test(url)) throw new Error('url không hợp lệ');
    redirects.push(`/${slug}  ${url}/  302`, `/${slug}/*  ${url}/:splat  302`);
    console.log('✓', slug, '→', url, '(chuyển hướng)');
  } catch (e) {
    console.error('Bỏ qua', slug, ':', e.message);
  }
}
if (redirects.length) fs.writeFileSync(path.join(DIST, '_redirects'), redirects.join('\n') + '\n');

fs.rmSync(TMP, { recursive: true, force: true });
console.log('Xong → ' + DIST);
