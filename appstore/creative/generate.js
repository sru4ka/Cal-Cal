// Renders App Store "Creative Assets" for Cal Cal:
//   header.png  3840x1646 (21:9 product page header)
//   search.png  3840x2560 (3:2 search results asset)
const { chromium } = require('playwright-core');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUT = path.join(DIR, 'creative');
fs.mkdirSync(OUT, { recursive: true });

const b64 = (p, mime) => `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
const FONT = b64(path.join(DIR, 'Inter.ttf'), 'font/ttf');
const MASCOT = b64('/home/user/NewApp/art/Logo Next To Text.png', 'image/png');
const FLAME = b64('/home/user/NewApp/art/streak_flame.png', 'image/png');

async function preparePhoto() {
  // Bright, slightly saturated, cropped to a square centred on the bowl.
  const src = path.join(DIR, 'dl', 'poke_wp.jpg');
  const out = path.join(OUT, 'photo_sq.jpg');
  await sharp(src)
    .rotate()
    .extract({ left: 0, top: 230, width: 1536, height: 1536 })
    .modulate({ brightness: 1.1, saturation: 1.18 })
    .sharpen()
    .jpeg({ quality: 94 })
    .toFile(out);
  return b64(out, 'image/jpeg');
}

const CSS = (W, H) => `
@font-face{font-family:Inter;src:url(${FONT});font-weight:100 900}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;color:#121714;background:#F3F7F4;position:relative;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;background:
  radial-gradient(1400px 1100px at 88% 8%, rgba(25,204,107,.30), transparent 62%),
  radial-gradient(1200px 900px at 6% 95%, rgba(247,163,46,.16), transparent 60%),
  radial-gradient(900px 700px at 50% 110%, rgba(77,143,242,.10), transparent 60%),
  linear-gradient(180deg,#F7FAF8 0%,#EEF6F1 100%)}
.grid{position:absolute;inset:0;opacity:.35;background-image:
  linear-gradient(rgba(18,23,20,.035) 1px,transparent 1px),
  linear-gradient(90deg,rgba(18,23,20,.035) 1px,transparent 1px);background-size:120px 120px}
.safe{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:150px}
.brand{display:flex;align-items:center;gap:26px;margin-bottom:54px}
.brand img{width:118px;height:118px;filter:drop-shadow(0 10px 18px rgba(0,0,0,.14))}
.brand b{font-size:66px;font-weight:800;letter-spacing:-.02em}
.brand span{display:inline-block;margin-left:22px;padding:14px 28px;border-radius:999px;background:rgba(25,204,107,.14);color:#0D9E52;font-size:34px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
h1{font-size:196px;line-height:.98;font-weight:800;letter-spacing:-.035em}
h1 em{font-style:normal;color:#0D9E52}
.sub{margin-top:46px;font-size:56px;line-height:1.3;color:#4A524E;font-weight:500;max-width:1250px}
.pills{display:flex;gap:22px;margin-top:62px;flex-wrap:wrap}
.pill{display:flex;align-items:center;gap:16px;padding:22px 38px;border-radius:999px;background:#fff;box-shadow:0 10px 30px rgba(18,23,20,.08);font-size:40px;font-weight:700}
.pill i{width:22px;height:22px;border-radius:50%;background:#19CC6B;display:inline-block}
.stage{position:relative;width:1380px;height:1380px;flex:none}
.photo{position:absolute;left:90px;top:40px;width:1200px;height:1200px;border-radius:120px;overflow:hidden;box-shadow:0 60px 120px rgba(18,23,20,.22),0 0 0 14px #fff}
.photo img{width:100%;height:100%;object-fit:cover;display:block}
.corner{position:absolute;width:150px;height:150px;border:14px solid #fff;filter:drop-shadow(0 4px 10px rgba(0,0,0,.35))}
.c1{left:120px;top:120px;border-right:0;border-bottom:0;border-radius:36px 0 0 0}
.c2{right:120px;top:120px;border-left:0;border-bottom:0;border-radius:0 36px 0 0}
.c3{left:120px;bottom:120px;border-right:0;border-top:0;border-radius:0 0 0 36px}
.c4{right:120px;bottom:120px;border-left:0;border-top:0;border-radius:0 0 36px 0}
.beam{position:absolute;left:0;right:0;top:46%;height:10px;background:linear-gradient(90deg,transparent,#19CC6B 20%,#19CC6B 80%,transparent);box-shadow:0 0 40px 10px rgba(25,204,107,.55)}
.card{position:absolute;background:#fff;border-radius:48px;box-shadow:0 40px 90px rgba(18,23,20,.22)}
.kcal{left:-60px;bottom:-30px;width:900px;padding:40px 46px;display:flex;align-items:center;gap:34px;transform:rotate(-3deg)}
.kcal .ico{width:124px;height:124px;border-radius:36px;background:#E8F9EF;display:flex;align-items:center;justify-content:center;flex:none}
.kcal .ico img{width:76px;height:76px}
.kcal .t{font-size:38px;color:#858C8A;font-weight:600;display:flex;align-items:center;gap:14px}
.kcal .t i{width:30px;height:30px;border-radius:50%;background:#19CC6B;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-style:normal;font-weight:800}
.kcal .n{font-size:64px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.kcal .n small{font-size:44px;font-weight:700;color:#121714;margin-left:14px}
.kcal .name{font-size:36px;font-weight:600;color:#4A524E;margin-top:4px}
.macros{right:-80px;top:40px;padding:30px;display:flex;gap:18px;transform:rotate(3deg)}
.m{width:210px;padding:28px 0 24px;border-radius:34px;text-align:center}
.m b{display:block;font-size:56px;font-weight:800;letter-spacing:-.02em}
.m span{display:block;font-size:26px;font-weight:800;letter-spacing:.08em;margin-top:6px}
.mp{background:#FDECEF}.mp b,.mp span{color:#F2596B}
.mc{background:#FFF3E2}.mc b,.mc span{color:#E08A12}
.mf{background:#EAF1FE}.mf b,.mf span{color:#4D8FF2}
.conf{position:absolute;left:120px;top:-30px;padding:20px 34px;border-radius:999px;background:#0D9E52;color:#fff;font-size:34px;font-weight:800;box-shadow:0 20px 50px rgba(13,158,82,.35)}
.mascot{position:absolute;right:-40px;bottom:-20px;width:300px;transform:rotate(8deg);filter:drop-shadow(0 20px 40px rgba(0,0,0,.2))}
`;

const stage = (PHOTO) => `
<div class="stage">
  <div class="photo"><img src="${PHOTO}">
    <div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
    <div class="beam"></div>
  </div>
  <div class="conf">AI identified · 96% confident</div>
  <div class="card macros">
    <div class="m mp"><b>38g</b><span>PROTEIN</span></div>
    <div class="m mc"><b>32g</b><span>CARBS</span></div>
    <div class="m mf"><b>26g</b><span>FAT</span></div>
  </div>
  <div class="card kcal">
    <div class="ico"><img src="${FLAME}"></div>
    <div>
      <div class="t"><i>✓</i> Meal logged in 3 seconds</div>
      <div class="n">512<small>kcal</small></div>
      <div class="name">Salmon Poke Bowl</div>
    </div>
  </div>
  <img class="mascot" src="${MASCOT}">
</div>`;

const headerHTML = (PHOTO) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(3840, 1646)}
.safe{width:2760px;justify-content:space-between}
.txt{width:1400px}
h1{font-size:172px}
.sub{font-size:48px;margin-top:38px;max-width:1150px}
.pills{margin-top:50px;gap:18px}
.pill{font-size:36px;padding:18px 32px}
.brand{margin-bottom:44px}
.brand img{width:104px;height:104px}.brand b{font-size:58px}.brand span{font-size:30px}
.stage{transform:scale(.88);transform-origin:center}
</style></head><body>
<div class="bg"></div><div class="grid"></div>
<div class="safe">
  <div class="txt">
    <div class="brand"><img src="${MASCOT}"><b>Cal Cal</b><span>AI calorie counter</span></div>
    <h1>Snap a photo.<br>Know your <em>calories.</em></h1>
    <div class="sub">Calories, protein, carbs and fat from one picture.<br>No searching, no typing.</div>
    <div class="pills">
      <div class="pill"><i></i>Photo scan</div>
      <div class="pill"><i></i>Barcode</div>
      <div class="pill"><i></i>AI coach</div>
      <div class="pill"><i></i>Apple Health</div>
    </div>
  </div>
  ${stage(PHOTO)}
</div>
</body></html>`;

const searchHTML = (PHOTO) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(3840, 2560)}
.safe{flex-direction:column;gap:90px;width:3100px;text-align:center}
.brand{justify-content:center;margin-bottom:40px}
h1{font-size:230px}
.sub{margin:40px auto 0;max-width:2200px;font-size:64px}
.pills{justify-content:center;margin-top:50px}
.stage{width:1380px;height:1380px;transform:scale(.92);margin:-30px 0}
</style></head><body>
<div class="bg"></div><div class="grid"></div>
<div class="safe">
  <div class="txt">
    <div class="brand"><img src="${MASCOT}"><b>Cal Cal</b><span>AI calorie counter</span></div>
    <h1>Snap a photo.<br>Know your <em>calories.</em></h1>
  </div>
  ${stage(PHOTO)}
  <div class="txt">
    <div class="pills">
      <div class="pill"><i></i>Photo scan</div>
      <div class="pill"><i></i>Barcode</div>
      <div class="pill"><i></i>AI coach</div>
      <div class="pill"><i></i>Apple Health</div>
    </div>
  </div>
</div>
</body></html>`;

(async () => {
  const PHOTO = await preparePhoto();
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const jobs = [
    ['header', 3840, 1646, headerHTML(PHOTO)],
    ['search', 3840, 2560, searchHTML(PHOTO)],
  ];
  for (const [name, W, H, html] of jobs) {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const raw = path.join(OUT, `${name}_raw.png`);
    await page.screenshot({ path: raw, fullPage: false });
    await page.close();
    // Flatten: Apple rejects alpha channels. Export PNG (no alpha) + JPG.
    await sharp(raw).flatten({ background: '#F3F7F4' }).removeAlpha().png({ compressionLevel: 9 }).toFile(path.join(OUT, `calcal_${name}_${W}x${H}.png`));
    await sharp(raw).flatten({ background: '#F3F7F4' }).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(path.join(OUT, `calcal_${name}_${W}x${H}.jpg`));
    await sharp(raw).resize({ width: 1400 }).jpeg({ quality: 80 }).toFile(path.join(OUT, `${name}_preview.jpg`));
    fs.unlinkSync(raw);
    const m = await sharp(path.join(OUT, `calcal_${name}_${W}x${H}.png`)).metadata();
    console.log(name, m.width, m.height, 'alpha:', m.hasAlpha, 'channels:', m.channels);
  }
  await browser.close();
})();
