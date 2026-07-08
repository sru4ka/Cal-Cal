// Fridge screen (540x1114 @2x = 1080x2228), recreated from real device screenshots
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const S = __dirname;

const chip = (t) => `<span style="display:inline-flex;align-items:center;gap:7px;background:#F3F5F4;border-radius:999px;padding:9px 14px;font-size:13.5px;font-weight:600;margin:0 7px 9px 0">${t} <span style="color:#B9C0BD;font-size:12px">✕</span></span>`;
const cat = (emoji, name, items) => `
  <div style="font-size:14px;font-weight:800;margin:14px 0 9px">${emoji} ${name}</div>
  <div>${items.map(chip).join('')}</div>`;

const BODY = `
<div style="position:absolute;inset:0;background:linear-gradient(#CEE9DC, #EDF4EF 130px, #F5F5F7 260px)"></div>
<div style="position:relative;padding:14px 16px 0">
  <div style="font-size:30px;font-weight:800;letter-spacing:-.02em;padding:10px 2px 12px">Fridge</div>

  <div style="display:flex;background:rgba(18,23,20,.06);border-radius:999px;padding:4px;margin-bottom:14px">
    <div style="flex:1;text-align:center;background:#fff;border-radius:999px;padding:9px 0;font-size:14px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.08)">My Fridge</div>
    <div style="flex:1;text-align:center;padding:9px 0;font-size:14px;font-weight:600;color:#6a7370">My Food</div>
    <div style="flex:1;text-align:center;padding:9px 0;font-size:14px;font-weight:600;color:#6a7370">Cookbook</div>
  </div>

  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:14px;box-shadow:0 3px 10px rgba(0,0,0,.035)">
    <div style="display:flex;align-items:center;gap:10px;background:#F3F5F4;border-radius:16px;padding:12px 14px;color:#9aa39f;font-size:15px;font-weight:500">
      <span style="width:22px;height:22px;border-radius:50%;background:#19CC6B;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:15px;font-weight:700">+</span>
      Add food... e.g. eggs, rice, spinach
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(25,204,107,.14);color:#0D9E52;border-radius:999px;padding:9px 16px;font-size:14.5px;font-weight:800">📷 Snap your fridge</div>
      
    </div>
  </div>

  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:16px;margin-top:12px;box-shadow:0 10px 26px rgba(0,0,0,.07)">
    <div style="font-size:18px;font-weight:800">What can I cook?</div>
    <div style="font-size:12.5px;color:#858C8A;font-weight:500;margin-top:3px">Pick the meal, we size suggestions to fit its share of your day.</div>
    <div style="display:flex;gap:7px;margin-top:12px">
      <div style="background:#F3F5F4;border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:700;color:#4a4d4a">🍳 Breakfast</div>
      <div style="background:#F3F5F4;border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:700;color:#4a4d4a">🥗 Lunch</div>
      <div style="background:#19CC6B;color:#fff;border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:800">🍽️ Dinner</div>
      <div style="background:#F3F5F4;border-radius:999px;padding:8px 13px;font-size:12.5px;font-weight:700;color:#4a4d4a">🍎 Snacks</div>
    </div>
    <div style="font-size:13px;font-weight:700;color:#0D9E52;margin-top:12px">Budget for dinner: ~1,269 kcal · 2,980 kcal left today</div>
    <div style="background:#19CC6B;color:#fff;border-radius:16px;height:50px;display:flex;align-items:center;justify-content:center;font-size:15.5px;font-weight:800;margin-top:12px;box-shadow:0 10px 24px rgba(25,204,107,.35)">✨ Suggest dinner</div>
  </div>

  <div style="background:#fff;border:1px solid #E9ECEE;border-radius:22px;padding:26px 16px;margin-top:12px;text-align:center">
    <img src="file://${S}/assets/empty_fridge.png" style="width:190px;margin:0 auto">
    <div style="font-size:19px;font-weight:800;margin-top:10px">Your fridge is empty</div>
    <div style="font-size:13px;color:#858C8A;font-weight:500;margin-top:5px;line-height:1.5">Type items above or snap a photo,<br>everything you add is saved here.</div>
  </div>
</div>

<div style="position:absolute;left:12px;right:12px;bottom:14px;height:64px;background:rgba(255,255,255,.96);border:1px solid #E9ECEE;border-radius:32px;display:flex;align-items:center;justify-content:space-around;box-shadow:0 8px 26px rgba(0,0,0,.08)">
  <div style="font-size:9.5px;font-weight:600;color:#9aa39f;text-align:center;width:64px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;margin:0 auto 2px;display:block"><path d="M3 10.5 12 3l9 7.5V21H3z"/></svg>Home</div>
  <div style="font-size:9.5px;font-weight:600;color:#9aa39f;text-align:center;width:64px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:22px;height:22px;margin:0 auto 2px;display:block"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>Progress</div>
  <div style="width:46px;height:46px;border-radius:50%;background:#121714;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;margin-top:-2px">+</div>
  <div style="font-size:9.5px;font-weight:700;color:#0D9E52;text-align:center;width:64px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:22px;height:22px;margin:0 auto 2px;display:block"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M10 6.5h.01M10 13.5h.01"/></svg>Fridge</div>
  <div style="font-size:9.5px;font-weight:600;color:#9aa39f;text-align:center;width:64px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:22px;height:22px;margin:0 auto 2px;display:block"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-3.6 4.5-5.5 8-5.5s6.5 1.9 8 5.5"/></svg>Profile</div>
</div>`;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 540, height: 1114 }, deviceScaleFactor: 2 });
  const f = path.join(S, 'screen_fridge.html');
  fs.writeFileSync(f, `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Inter'; src:url('file://${S}/Inter.ttf'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
body{width:540px;height:1114px;font-family:'Inter',sans-serif;background:#F5F5F7;color:#121714;overflow:hidden;position:relative}
</style></head><body>${BODY}</body></html>`);
  await page.goto('file://' + f);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(S, 'frames', 'gen_fridge.png') });
  console.log('fridge done');
  await browser.close();
})();
